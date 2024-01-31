import React, { useEffect, useState } from 'react';
import { images } from '../../Data/DataFetcher';
import copy from 'clipboard-copy';

function AllImages() {
  const [loading, setLoading] = useState(true);
  const [allImages, setAllImages] = useState([]);

  useEffect(() => {
    images
      .then((data) => {
        setAllImages(data);
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching images:', error));
  }, []);

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };
  const [isCopy, setIsCopy] = useState(false)
  const handleCopyClick = (text) => {
    return () => {
      copy(text)
        .then(() => {
          setIsCopy(true)
          // toast.success(text, "copied")
        })
        .catch((error) => {
          // console.error('Copy failed: ', error);
          setIsCopy(false)
        });
    };
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        {allImages.map((item, index) => (
          <div className='col-4 col-md-2 col-lg-2' key={index}>
            <div className='card p-2 mb-2'>
              {['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'].includes(getFileExtension(item.image.toLowerCase())) ? (
                // Render image style
                <img src={`https://bepractical.s3.us-east-2.amazonaws.com/${item.image}`} alt='' className='w-100' />
              ) : (
                // Render file style
                <div className='file-style'>
                  {/* Add styles or content for the file */}
                 
                  <div className="">
                  <i class="bi bi-folder-fill fs-1 text-warning"></i>
                  <span className='d-block'>{item.image}</span>
                  </div>
                </div>
              )}
              
              <small className='bg-primary rounded-1 text-white p-1 text-center' onClick={handleCopyClick(`https://bepractical.s3.us-east-2.amazonaws.com/${item.image}`)}>{isCopy? 'Copied':'Copy'}</small>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllImages;
