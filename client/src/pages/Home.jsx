import React, { useState, useEffect } from 'react';
import { Card, FormField, Loader } from '../components';

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }

  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">
      {title}
    </h2>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/v1/post', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          setAllPosts(result.data.reverse());
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts?.filter(
          (item) =>
            item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            item.prompt.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-20 text-center">
      {/* Hero Section */}
      <div className="mb-16 text-center px-4">
  <h1 className="text-5xl md:text-7xl font-light text-gray-800 leading-tight">
    <span className="block">
      Imagine with
      <span className="relative inline-block ml-2 font-bold bg-gradient-to-r from-sky-400 via-purple-500 to-emerald-400 bg-clip-text text-transparent 
          after:content-[''] after:block after:h-[4px] after:bg-purple-500 
          after:w-0 hover:after:w-full after:transition-all after:duration-500 after:mt-1">
        ImaginAI
      </span>
    </span>
  </h1>
  <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
    Transform your thoughts into art. Generate stunning AI-powered visuals with simple prompts.
  </p>
</div>


      {/* Search Field */}
      <div className="mt-14">
        <FormField
          labelName="Search Posts"
          type="text"
          name="text"
          placeholder="Search something..."
          value={searchText}
          handleChange={handleSearchChange}
          className="rounded-full border-2 border-blue-500 px-5 py-3 w-full text-gray-800 placeholder-gray-500 focus:outline-none focus:border-purple-600 transition-all duration-300 ease-in-out"
        />
      </div>

      {/* Cards Section */}
      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-xl mb-3 text-[#666e75]">
                Showing results for{' '}
                <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}

            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              <RenderCards
                data={searchText ? searchedResults : allPosts}
                title={
                  searchText ? 'No Search Results Found' : 'No Posts Yet'
                }
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
