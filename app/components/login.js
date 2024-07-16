// // "use client";
// // import React, { useState, useEffect } from 'react';
// // import Link from 'next/link';
// // import { Input, Button } from '@nextui-org/react';
// // import { signIn, useSession } from 'next-auth/react';
// // import { useRouter } from 'next/navigation';
// // import { IoIosEye, IoIosEyeOff } from "react-icons/io";
// // import { RiShieldUserFill } from "react-icons/ri";
// // import { toast } from 'sonner';

// // export default function LoginComponent() {
// //   const [isVisible, setIsVisible] = useState(false);
// //   const [userId, setUserId] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [userIdError, setUserIdError] = useState('');
// //   const [passwordError, setPasswordError] = useState('');
// //   const toggleVisibility = () => setIsVisible(!isVisible);
// //   const router = useRouter();
// //   const { data: session, status } = useSession();
// //   let role;

//   // useEffect(() => {
//   //   if (status === 'authenticated' && session?.user?.role) {
//   //      role = session.user.role;
//   //     if (role === 'superadmin' || role === 'admin') {
//   //       router.replace(`/admin`);
//   //     } else {
//   //       router.replace(`/${role}`);
//   //     }
//   //   }
//   // }, [session, status, router]);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setUserIdError('');
// //     setPasswordError('');

// //     try {
// //       const result = await signIn('credentials', {
// //         userId,
// //         password,
// //         redirect: false,
// //       });

// //       if (result.ok) {
// //         toast.success('Login Successful');
// //       } else {
// //         if (result.error === 'Invalid username') {
// //           setUserIdError('Invalid username');
// //         } else if (result.error === 'Invalid password') {
// //           setPasswordError('Invalid password');
// //         } else {
// //           toast.error('Failed to login');
// //         }
// //       }
// //     } catch (error) {
// //       console.error('Failed to login', error);
// //       toast.error('Failed to login');
// //     }
// //   };

// //   const handleCancel = () => {
// //     setUserId('');
// //     setPassword('');
// //     setUserIdError('');
// //     setPasswordError('');
// //   };

// //   return (
// //     <div className="flex h-screen">
// //       <div className="flex w-1/2 justify-center items-center bg-gray-100">
// //         <img src="/20824342_6343839.svg" alt="Login Illustration" className="w-full h-full object-cover"/>
// //       </div>
// //       <div className="flex w-1/2 justify-center items-center">
// //         <form onSubmit={handleSubmit} className="w-full max-w-md">
// //           <div className="w-full p-9 bg-white rounded-lg shadow-lg text-center">
// //             <h2 className="text-2xl font-bold mb-4">Login</h2>
// //             <div className="mb-4 text-left">
// //               <Input
// //                 type="text"
// //                 variant="bordered"
// //                 label="User Id"
// //                 value={userId}
// //                 onChange={(e) => setUserId(e.target.value)}
// //                 isInvalid={!!userIdError}
// //                 endContent={
// //                   <RiShieldUserFill className="text-2xl text-default-400 pointer-events-none"/>
// //                 }
// //                 className="mb-2"
// //               />
// //               {userIdError && <p className="text-red-500 text-sm">{userIdError}</p>}
// //             </div>
// //             <div className="mb-4 text-left">
// //               <Input
// //                 label="Password"
// //                 variant="bordered"
// //                 endContent={
// //                   <button
// //                     className="focus:outline-none"
// //                     type="button"
// //                     onClick={toggleVisibility}
// //                   >
// //                     {isVisible ? (
// //                       <IoIosEyeOff className="text-2xl text-default-400 pointer-events-none"/>
// //                     ) : (
// //                       <IoIosEye className="text-2xl text-default-400 pointer-events-none"/>
// //                     )}
// //                   </button>
// //                 }
// //                 type={isVisible ? 'text' : 'password'}
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //                 isInvalid={!!passwordError}
// //                 className="mb-2"
// //               />
// //               {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
// //             </div>
// //             <div className="flex justify-center space-x-4">
// //               <Button color="default" onClick={handleCancel} className="w-36">
// //                 Cancel
// //               </Button>
// //               <Button color="primary" type="submit" className="w-36">
// //                 Login
// //               </Button>
// //             </div>
// //             <div className="mt-2">
// //               <p className="text-sm">
// //                 <Link href="/reset_password" className="text-blue-500">
// //                   reset password
// //                 </Link>
// //               </p>
// //             </div>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }
// "use client";
// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { Input, Button } from '@nextui-org/react';
// import { signIn, useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { IoIosEye, IoIosEyeOff } from "react-icons/io";
// import { RiShieldUserFill } from "react-icons/ri";
// import { toast } from 'sonner';
// import axios from 'axios';

// export default function LoginComponent() {
//   const [isVisible, setIsVisible] = useState(false);
//   const [userId, setUserId] = useState('');
//   const [password, setPassword] = useState('');
//   const [userIdError, setUserIdError] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const toggleVisibility = () => setIsVisible(!isVisible);
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   const [userProfile, setUserProfile] = useState(null); 

// let role;
//   useEffect(() => {
//     if (userProfile?.role ) {
//        role = userProfile.role;
//       if (role === 'superadmin' || role === 'admin') {
//         router.replace(`/admin`);
//       } else {
//         router.replace(`/${role}`);
//       }
//     }
//   }, [userProfile]);
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       if (status === 'authenticated' && session?.user?.role) {
//         const role = session.user.role === "admin" || session.user.role === "superadmin" ? "faculty" : session.user.role;
//         const { id } = session.user;
//         const storedProfile = sessionStorage.getItem('userProfile');
//         setUserProfile(JSON.parse(storedProfile));
//         if (!storedProfile) {
//           try {
//             const res = await axios.get(`/api/${role}?_id=${id}`);
//             const profileData = Array.isArray(res.data) ? res.data[0] : res.data; // Ensure userProfile is an object
//             profileData.role = session?.user?.role; // Add role to profile data
//             sessionStorage.setItem('userProfile', JSON.stringify(profileData));
//           } catch (error) {
//             console.error("Error fetching user profile:", error);
//           }
//         }
//       }
//     };

//     if (status === 'authenticated') {
//       fetchUserProfile();
//     }
//   }, [session, status]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setUserIdError('');
//     setPasswordError('');

//     try {
//       const result = await signIn('credentials', {
//         userId,
//         password,
//         redirect: false,
//       });

//       if (result.ok) {
//         toast.success('Login Successful');
//       } else {
//         if (result.error === 'Invalid username') {
//           setUserIdError('Invalid username');
//         } else if (result.error === 'Invalid password') {
//           setPasswordError('Invalid password');
//         } else {
//           toast.error('Failed to login');
//         }
//       }
//     } catch (error) {
//       console.error('Failed to login', error);
//       toast.error('Failed to login');
//     }
//   };

//   const handleCancel = () => {
//     setUserId('');
//     setPassword('');
//     setUserIdError('');
//     setPasswordError('');
//   };

//   return (
//     <div className="flex h-screen">
//       <div className="flex w-1/2 justify-center items-center bg-gray-100">
//         <img src="/20824342_6343839.svg" alt="Login Illustration" className="w-full h-full object-cover"/>
//       </div>
//       <div className="flex w-1/2 justify-center items-center">
//         <form onSubmit={handleSubmit} className="w-full max-w-md">
//           <div className="w-full p-9 bg-white rounded-lg shadow-lg text-center">
//             <h2 className="text-2xl font-bold mb-4">Login</h2>
//             <div className="mb-4 text-left">
//               <Input
//                 type="text"
//                 variant="bordered"
//                 label="User Id"
//                 value={userId}
//                 onChange={(e) => setUserId(e.target.value)}
//                 isInvalid={!!userIdError}
//                 endContent={
//                   <RiShieldUserFill className="text-2xl text-default-400 pointer-events-none"/>
//                 }
//                 className="mb-2"
//               />
//               {userIdError && <p className="text-red-500 text-sm">{userIdError}</p>}
//             </div>
//             <div className="mb-4 text-left">
//               <Input
//                 label="Password"
//                 variant="bordered"
//                 endContent={
//                   <button
//                     className="focus:outline-none"
//                     type="button"
//                     onClick={toggleVisibility}
//                   >
//                     {isVisible ? (
//                       <IoIosEyeOff className="text-2xl text-default-400 pointer-events-none"/>
//                     ) : (
//                       <IoIosEye className="text-2xl text-default-400 pointer-events-none"/>
//                     )}
//                   </button>
//                 }
//                 type={isVisible ? 'text' : 'password'}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 isInvalid={!!passwordError}
//                 className="mb-2"
//               />
//               {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
//             </div>
//             <div className="flex justify-center space-x-4">
//               <Button color="default" onClick={handleCancel} className="w-36">
//                 Cancel
//               </Button>
//               <Button color="primary" type="submit" className="w-36">
//                 Login
//               </Button>
//             </div>
//             <div className="mt-2">
//               <p className="text-sm">
//                 <Link href="/reset_password" className="content-start text-blue-500">
//                   Reset password
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input, Button } from '@nextui-org/react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { RiShieldUserFill } from "react-icons/ri";
import { toast } from 'sonner';
import axios from 'axios';

export default function LoginComponent() {
  const [isVisible, setIsVisible] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [userIdError, setUserIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState(null); 

  useEffect(() => {
    if (userProfile?.role) {
      const role = userProfile.role;
      const redirectPath = role === 'superadmin' || role === 'admin' ? `/admin` : `/${role}`;
      router.replace(redirectPath);
    }
  }, [userProfile]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (status === 'authenticated' && session?.user?.role) {
        const role = session.user.role === "admin" || session.user.role === "superadmin" ? "faculty" : session.user.role;
        const { id } = session.user;
        const storedProfile = sessionStorage.getItem('userProfile');

        if (storedProfile) {
          setUserProfile(JSON.parse(storedProfile));
        } else {
          try {
            const res = await axios.get(`/api/${role}?_id=${id}`);
            const profileData = Array.isArray(res.data) ? res.data[0] : res.data; // Ensure userProfile is an object
            profileData.role = session?.user?.role; // Add role to profile data
            sessionStorage.setItem('userProfile', JSON.stringify(profileData));
            setUserProfile(profileData);
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
        }
      }
    };

    if (status === 'authenticated') {
      fetchUserProfile();
    }
  }, [session, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUserIdError('');
    setPasswordError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        userId,
        password,
        redirect: false,
      });

      setIsLoading(false);

      if (result.ok) {
        toast.success('Login Successful');
      } else {
        if (result.error === 'Invalid username') {
          setUserIdError('Invalid username');
        } else if (result.error === 'Invalid password') {
          setPasswordError('Invalid password');
        } else {
          toast.error('Failed to login');
        }
      }
    } catch (error) {
      console.error('Failed to login', error);
      toast.error('Failed to login');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUserId('');
    setPassword('');
    setUserIdError('');
    setPasswordError('');
  };

  return (
    <div className="flex h-screen">
      <div className="flex w-1/2 justify-center items-center bg-gray-100">
        <img src="/20824342_6343839.svg" alt="Login Illustration" className="w-full h-full object-cover"/>
      </div>
      <div className="flex w-1/2 justify-center items-center">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="w-full p-9 bg-white rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <div className="mb-4 text-left">
              <Input
                type="text"
                variant="bordered"
                label="User Id"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                isInvalid={!!userIdError}
                endContent={
                  <RiShieldUserFill className="text-2xl text-default-400 pointer-events-none"/>
                }
                className="mb-2"
              />
              {userIdError && <p className="text-red-500 text-sm">{userIdError}</p>}
            </div>
            <div className="mb-4 text-left">
              <Input
                label="Password"
                variant="bordered"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <IoIosEyeOff className="text-2xl text-default-400 pointer-events-none"/>
                    ) : (
                      <IoIosEye className="text-2xl text-default-400 pointer-events-none"/>
                    )}
                  </button>
                }
                type={isVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!passwordError}
                className="mb-2"
              />
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            </div>
            <div className="flex justify-center space-x-4">
              <Button color="default" onClick={handleCancel} className="w-36">
                Cancel
              </Button>
              <Button color="primary" type="submit" className="w-36" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Login'}
              </Button>
            </div>
            <div className="mt-2">
              <p className="text-sm">
                <Link href="/reset_password" className="content-start text-blue-500">
                  Reset password
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
