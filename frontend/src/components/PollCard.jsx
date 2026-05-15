import { Link } from "react-router-dom"

const PollCard = ({ poll, onDelete }) => {

  return (

    <div className="bg-white shadow-md rounded-xl p-4 mb-4 hover:shadow-lg transition">

      <h2 className="text-xl font-semibold">{poll.title}</h2>

      <p className="text-gray-500">{poll.description}</p>

      <p className="text-sm text-gray-400">
        Code: {poll.pollCode}
      </p>

      <div className="flex gap-3 mt-3">

        <Link
          className="text-blue-600"
          to={`/poll/${poll.pollCode}`}
        >
          Open
        </Link>

        <Link
          className="text-green-600"
          to={`/analytics/${poll._id}`}
        >
          Analytics
        </Link>

        <button
          onClick={() => onDelete(poll._id)}
          className="text-red-500"
        >
          Delete
        </button>

      </div>

    </div>
  )
}

export default PollCard