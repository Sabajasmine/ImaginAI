import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../components';

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageCount, setImageCount] = useState(0);

  useEffect(() => {
    const count = localStorage.getItem('imageCount');
    if (count) {
      setImageCount(parseInt(count, 10));
    }
  }, []);

  const generateImage = async () => {
    if (form.prompt) {
      try {
        if (imageCount >= 1000000) {
          alert('You have reached the limit of 1000 images per day.');
          return;
        }

        setGeneratingImg(true);
        const response = await fetch('http://localhost:8000/api/v1/imgGenerate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${STABILITY_AI_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        const data = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
        setImageCount(imageCount + 1);
        localStorage.setItem('imageCount', imageCount + 1);
      } catch (error) {
        alert(error);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please Provide a prompt")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);

      try {
        const response = await fetch('http://localhost:8000/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form)
        })

        await response.json();
        navigate("/");
      } catch (error) {
        alert(error)
      } finally {
        setLoading(false)
      }
    } else {
      alert("Please enter a prompt and generate an image");
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
      <h1 className="font-bold text-[#222328] text-[30px] relative inline-block after:content-[''] after:block after:h-[3px] after:bg-purple-500 after:w-full after:mt-1">
  Create
</h1>

        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">Generate an imaginative images and share it with the community</p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Ex. Jasmine"
            value={form.name}
            handleChange={handleChange}
          />

          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A cat with a specs...."
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          <div className="relative bg-gradient-to-b from-[#E2E8F0] to-[#F0F4F8] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-40 rounded-lg">
                <img
                  src={preview}
                  alt="preview"
                  className="w-9/12 h-9/12 object-contain"
                />
              </div>
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-10 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className={`text-white bg-gradient-to-r from-[#4CAF50] to-[#45A249] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center focus:outline-none transition-all duration-300 ${generatingImg ? 'cursor-not-allowed opacity-70' : 'hover:opacity-90'}`}
            disabled={generatingImg}
          >
            {generatingImg ? 'Generating...' : 'Generate'}
          </button>
        </div>


        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">
            <strong>Ready to showcase your creation?</strong> Share your imaginative image with the community!
          </p>
          <button
            type="submit"
            className={`mt-4 text-white bg-gradient-to-r from-[#3B82F6] to-[#2563EB] font-medium rounded-md text-sm w-full sm:w-auto px-6 py-3 focus:outline-none transition-all duration-300 hover:opacity-90 transform hover:scale-105`}
            disabled={loading}
          >
            {loading ? 'Sharing...' : 'Share with the Community'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;