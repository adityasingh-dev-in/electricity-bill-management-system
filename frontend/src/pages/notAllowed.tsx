import { useNavigate } from "react-router-dom"


const notAllowed = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-full bg-zinc-900 flex justify-center items-center text-3xl text-white">
      <p>You are not Allowed to access this page</p>
      <button onClick={()=>{
        navigate('/')
      }} className="bg-blue-500 text-white px-4 py-2 rounded-md">Go to Home</button>
    </div>
  )
}

export default notAllowed