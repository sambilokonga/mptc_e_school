import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

const SearchBar = ({ data }) => {

  const navigate = useNavigate()
  const [input, setInput] = React.useState(data ? data : "")

  const onSearchHandler = (e) => {
    e.preventDefault()
    if (input.trim()) {
      navigate("/course-list/" + input)
    }
  }

  return (
    <form
      onSubmit={onSearchHandler}
      className='max-w-2xl w-full flex items-center bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-full border border-gray-100 p-2 overflow-hidden'
    >
      <div className="pl-4 pr-2 text-gray-400">
        <Search className="w-5 h-5" />
      </div>
      <input
        onChange={e => setInput(e.target.value)}
        value={input}
        type="text"
        placeholder='What do you want to learn today?'
        className='flex-1 h-12 outline-none text-gray-700 bg-transparent text-lg placeholder-gray-400'
      />
      <button
        type='submit'
        className='bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 text-white font-medium rounded-full px-8 py-3'
      >
        Search
      </button>
    </form>
  )
}

export default SearchBar
