import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/connectDb";
import Attendance from "@/models/attendance";



export async function POST(req) {
    try {
        await connectMongoDB();
        const data = await req.json();
        const { date, subject, sessions, records } = data;

        console.log(data);  
        if (data) {
            const validatedRecords = records.map(record => ({
                student: record.student,
                status: record.status || 'absent' // Assuming default status if not provided
            }));

            // Save attendance for each session
            const attendancePromises = sessions.map(session => {
                return Attendance.findOneAndUpdate(
                    { date: new Date(date), subject, session },
                    { 
                        $setOnInsert: { date: new Date(date), subject, session },
                        $set: { records: validatedRecords }
                    },
                    { upsert: true, new: true, runValidators: true }
                );
            });

            const savedAttendances = await Promise.all(attendancePromises);

            console.log("Attendance Recorded Successfully", savedAttendances);
            return NextResponse.json({ message: "Attendance Recorded Successfully", attendances: savedAttendances }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Invalid Input Data" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error recording attendance:", error);
        return NextResponse.json({ error: "Failed to Record Attendance" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectMongoDB();
        const data = await req.json();
        const { _id, date, subject, records } = data;

        // Validate and update each record if needed
        const validatedRecords = records.map(record => ({
            student: record.student,
            status: record.status || 'absent' // Assuming default status if not provided
        }));

        const existingAttendance = await Attendance.findByIdAndUpdate(_id, {
            date,
            subject,
            records: validatedRecords
        }, { new: true });

        if (!existingAttendance) {
            return NextResponse.json({ error: "Attendance record not found" });
        }

        console.log("Attendance Updated Successfully", existingAttendance);
        return NextResponse.json({ message: "Attendance Updated Successfully", attendance: existingAttendance });
    } catch (error) {
        console.error("Error updating attendance:", error);
        return NextResponse.json({ error: "Failed to Update Attendance" });
    }
}

export async function DELETE(req) {
    try {
        await connectMongoDB();
        const { searchParams } = new URL(req.url);
        const _id = searchParams.get("_id");
        const deletedAttendance = await Attendance.findByIdAndDelete(_id);

        if (!deletedAttendance) {
            return NextResponse.json({ error: "Attendance record not found" }, { status: 404 });
        }

        console.log("Attendance Record Deleted Successfully", deletedAttendance);
        return NextResponse.json({ message: "Attendance Record Deleted Successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting attendance record:", error);
        return NextResponse.json({ error: "Failed to Delete Attendance Record" }, { status: 500 });
    }
}
export async function GET(req) {
    try {
        await connectMongoDB();
        const { searchParams } = new URL(req.url);
        const subjectId = searchParams.get("subjectId");
        const startDate = new Date(searchParams.get("startDate"));
        const endDate = new Date(searchParams.get("endDate"));

        const pipeline = [
            {
                $match: {
                    subject: subjectId,
                    date: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: "$subject",
                    totalLectures: { $sum: 1 },
                    records: { $push: "$records" }
                }
            },
            {
                $unwind: "$records"
            },
            {
                $unwind: "$records"
            },
            {
                $group: {
                    _id: {
                        subject: "$_id",
                        student: "$records.student"
                    },
                    totalLectures: { $first: "$totalLectures" },
                    presentCount: {
                        $sum: {
                            $cond: [{ $eq: ["$records.status", "present"] }, 1, 0]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "students",
                    localField: "_id.student",
                    foreignField: "_id",
                    as: "studentInfo"
                }
            },
            {
                $unwind: "$studentInfo"
            },
            {
                $lookup: {
                    from: "subjects",
                    localField: "_id.subject",
                    foreignField: "_id",
                    as: "subjectInfo"
                }
            },
            {
                $unwind: "$subjectInfo"
            },
            {
                $lookup: {
                    from: "faculties",
                    localField: "subjectInfo.teacher",
                    foreignField: "_id",
                    as: "teacherInfo"
                }
            },
            {
                $unwind: "$teacherInfo"
            },
            {
                $group: {
                    _id: "$_id.subject",
                    subjectName: { $first: "$subjectInfo.name" },
                    teacherName: { $first: "$teacherInfo.name" },
                    totalLectures: { $first: "$totalLectures" },
                    students: {
                        $push: {
                            name: "$studentInfo.name",
                            presentCount: "$presentCount",
                            attendancePercentage: {
                                $multiply: [{ $divide: ["$presentCount", "$totalLectures"] }, 100]
                            }
                        }
                    }
                }
            }
        ];

        const [result] = await Attendance.aggregate(pipeline);

        if (!result) {
            return NextResponse.json({ error: "No data found" }, { status: 404 });
        }

        const formattedResult = {
            subjectName: result.subjectName,
            teacherName: result.teacherName,
            totalLectures: result.totalLectures,
            students: result.students
        };

        console.log("Aggregated Attendance Report Successfully", formattedResult);
        return NextResponse.json(formattedResult, { status: 200 });
    } catch (error) {
        console.error("Error fetching aggregated attendance report:", error);
        return NextResponse.json({ error: "Failed to Fetch Aggregated Attendance Report" }, { status: 500 });
    }
}