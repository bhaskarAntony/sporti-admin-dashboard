import './App.css';
import EventsUpload from './components/EventsUpload';
import SidebarMenu from 'react-bootstrap-sidebar-menu';
import SideNav from './components/SideNav';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TrainingMode from './components/TrainingMode';
import Companies from './components/Companies';
import YoutubeVideos from './components/YoutubeVideo';
import Advantages from './components/Advantages';
import Testimonials from './components/Testimonials';
import BlogPost from './components/BlogsPost';


function App() {
  return (
    <>
    <SideNav/>
    <BrowserRouter>
    <Routes>
      <Route path='/hero' element={<EventsUpload/>}/>
      <Route path='/training-mode' element={<TrainingMode/>}/>
      <Route path='/companies' element={<Companies/>}/>
      <Route path='/youtube-videos' element={<YoutubeVideos/>}/>
      <Route path='/advantages' element={<Advantages/>}/>
      <Route path='/testimonials' element={<Testimonials/>}/>
      <Route path='/blogs' element={<BlogPost/>}/>
    </Routes>
    </BrowserRouter>
    </>
  
  );
}

export default App;