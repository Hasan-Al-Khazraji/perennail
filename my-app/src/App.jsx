import { useEffect, useState } from "react";
import ImgUploader from './imgUploader';
import './App.css';

function App()
{
    return(
        <div className="page">
            <div className="leftSide">
                <ImgUploader/>
            </div>
            <div className="rightSide">
                <ImgUploader/>
            </div>
        </div>
    )
}

export default App;