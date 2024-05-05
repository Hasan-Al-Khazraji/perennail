import React, { useState } from "react";
import './imgUploader.css';
import { imgDb } from './Config';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from 'uuid';


export default function ImgUploader()
{
    const [uploadValid, setUploadValid] = useState(false);
    const [file, setFile] = useState(null);
    const [uploadedFileURL, setUploadedFileURL] = useState(null)

    function handleChange(event)
    {
        const selectedFile = event.target.files[0];
        if (!selectedFile)
            {
                alert('No file selected!');
                return;
            }
        setFile(event.target.files[0]);
        setUploadValid(false);
        setUploadedFileURL(null);
    }

    function handleSubmit(event)
    {
        event.preventDefault();
        if (!file) {
            alert('Please select a file first!');
            return;
        }
        const imgRef = ref(imgDb, `files/theImage.jpg`);
        uploadBytes(imgRef, file).then((snapshot) => {
            console.log('Uploaded a blob or file!');
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                setUploadedFileURL(downloadURL);
                setUploadValid(true);
            }).catch((error) => {
                console.error('Error retrieving file URL', error);
                alert('Error retrieving file URL!');
                setUploadValid(false);
            });
        }).catch((error) => {
            console.error('Upload failed', error);
            alert('Upload failed!');
            setUploadValid(false);
        });
            
    }

    return(
        <div className="h-56 grid grid-flow-row auto-rows-max">
            <div className="imgDisplay min-w-30 min-h-25 flex justify-center items-center">
                {
                    uploadValid && uploadedFileURL
                    ? <img src={uploadedFileURL} alt="YOUR IMAGE HERE" className="rounded-3xl shadow-[0_35px_60px_-15px_rgba(0,221,158,0.3)]" style={{ maxWidth: '500px', maxHeight: '400px' }}/>
                    : <div className="plantFeels">
                            <svg fill="#00dd9e" height="85%" width="85%" version="1.1" id="Capa_1" viewBox="0 0 473.044 473.044">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path d="M291.042,86.103c11.091,8.357,24.345,12.549,37.606,12.549c16.018,0,32.036-6.098,44.23-18.292 c1.594-1.594,2.489-3.756,2.489-6.01s-0.896-4.417-2.489-6.01c-16.654-16.654-40.439-21.926-61.617-15.835 c3.594-17.515-1.377-36.454-14.938-50.015C294.728,0.896,292.567,0,290.312,0c-2.254,0-4.416,0.896-6.011,2.49 c-10.386,10.386-16.105,24.194-16.105,38.882c0,11.95,3.787,23.317,10.791,32.732c-3.831,4.119-7.48,8.375-10.919,12.78 c-3.311-10.163-10.248-19.18-20.231-24.897c-1.957-1.121-4.279-1.418-6.453-0.827c-2.176,0.591-4.027,2.022-5.147,3.979 c-5.926,10.347-7.468,22.382-4.341,33.889c2.443,8.991,7.517,16.808,14.551,22.627c-1.655,3.42-3.227,6.89-4.69,10.422 c-1.396,3.371-2.684,6.772-3.884,10.195c-2.279-8.882-5.186-17.626-8.735-26.195c-8.583-20.722-20.498-39.546-35.478-56.081 c8.879-20.556,1.08-45.02-18.802-56.406c-4.073-2.333-9.267-0.922-11.6,3.152c-5.744,10.03-7.152,21.376-4.82,31.857 c-16.32-2.93-33.771,1.887-46.358,14.475c-3.319,3.319-3.32,8.701,0,12.021c9.892,9.893,23.045,15.341,37.035,15.341 c11.283,0,22.019-3.549,30.942-10.11c30.287,32.861,46.889,75.257,46.889,120.209v16v41.591 c-8.267-18.482-19.248-35.38-32.744-50.404c14.78-20.459,12.973-49.271-5.436-67.679c-3.319-3.319-8.701-3.319-12.021,0 c-12.233,12.233-17.13,29.061-14.707,44.98c-21.214-6.311-45.154-1.109-61.873,15.609c-3.32,3.319-3.32,8.701,0,12.021 c12.137,12.138,28.081,18.206,44.024,18.206c13.034,0,26.065-4.061,37.019-12.173c5.157,5.702,9.9,11.688,14.228,17.916 c-16.198-0.741-32.253,7.375-40.85,22.388c-2.333,4.074-0.922,9.267,3.152,11.6c6.846,3.921,14.431,5.922,22.113,5.922 c3.928,0,7.883-0.524,11.775-1.582c7.408-2.013,14.018-5.813,19.374-11.021c10.438,22.849,15.945,47.87,15.945,73.741v0.764h-63.199 c-4.694,0-8.5,3.806-8.5,8.5v35.687c0,4.694,3.806,8.5,8.5,8.5h7.763l7.912,84.238c0.41,4.367,4.076,7.705,8.463,7.705h90.122 c4.387,0,8.053-3.338,8.463-7.705l7.912-84.238h7.763c4.694,0,8.5-3.806,8.5-8.5v-35.687c0-4.694-3.806-8.5-8.5-8.5h-58.198v-31.876 c0.011-24.425,4.931-48.091,14.273-69.885c8.716,5.758,18.788,8.638,28.86,8.638c13.412,0,26.824-5.105,37.035-15.315 c1.594-1.594,2.489-3.756,2.489-6.011s-0.896-4.417-2.489-6.01c-12.832-12.832-30.72-17.596-47.31-14.302 c4.824-6.75,10.143-13.208,15.953-19.317c32.392-2.321,58.042-29.398,58.042-62.371c0-4.694-3.806-8.5-8.5-8.5 c-33.576,0-61.048,26.595-62.482,59.824c-14.936,15.859-26.975,33.913-35.873,53.804v-10.558 C243.946,161.48,260.624,118.995,291.042,86.103z M247.538,83.844c4.444,5.777,6.442,13.132,5.533,20.364 c-2.181-2.829-3.807-6.086-4.771-9.637S247.088,87.387,247.538,83.844z M353.439,74.35c-15.021,9.749-34.564,9.748-49.583,0 C318.875,64.604,338.419,64.603,353.439,74.35z M290.305,22.312c6.806,11.742,6.806,26.379,0,38.121 c-3.334-5.728-5.109-12.257-5.109-19.061S286.971,28.039,290.305,22.312z M174.571,25.463c4.431,5.769,6.425,13.108,5.523,20.326 C175.664,40.02,173.669,32.682,174.571,25.463z M149.114,63.435c-6.048,0-11.863-1.507-17.018-4.344 c10.562-5.789,23.476-5.789,34.036,0C160.977,61.928,155.161,63.435,149.114,63.435z M187.169,248.525 c-3.552,0.965-7.186,1.212-10.726,0.762c5.777-4.444,13.133-6.444,20.364-5.533C193.978,245.935,190.72,247.56,187.169,248.525z M182.755,150.073c5.78,10.555,5.78,23.454,0,34.009C176.976,173.527,176.976,160.628,182.755,150.073z M119.617,196.642 c14.894-9.631,34.253-9.63,49.146,0C153.87,206.273,134.511,206.274,119.617,196.642z M304.084,213.964 c-10.556,5.78-23.455,5.779-34.009,0C280.628,208.184,293.527,208.183,304.084,213.964z M332.805,121.459 c-3.728,17.513-17.548,31.333-35.061,35.06C301.472,139.007,315.293,125.187,332.805,121.459z M270.267,456.044h-74.644 l-7.039-74.943h88.721L270.267,456.044z M293.644,364.101H172.247v-18.687h121.397V364.101z"></path>
                                </g>
                            </svg>
                            <p className=" text-white font-abc font-bold">How is your plant feeling today?</p>
                        </div>
                }
            </div>
            <div className="uploadFile">
                <form onSubmit={handleSubmit}>
                    
<div class="flex items-center justify-center w-full">
    <label for="dropzone-file" class="flex flex-col items-center justify-center w-80 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 mt-10">
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
        </div>
        <input onChange={handleChange} id="dropzone-file" type="file" class="hidden" />
    </label>
    <button type="submit" className="transition duration-200 ease-in-out text-black ml-4 mt-2 rounded-xl bg-primary w-20 h-20 font-abc hover:font-bold">Upload</button>
</div> 
                </form>
            </div>
        </div>
    );
}

