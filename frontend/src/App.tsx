import './App.css';
import { Route, Routes } from 'react-router-dom';
import AllNews from './Containers/AllNews/AllNews.tsx';
import Toolbar from './Components/UI/Toolbar/Toolbar.tsx';
import AddNews from './Containers/AddNews/AddNews.tsx';

const App = () => {
  return <>
    <Toolbar/>
    <div className="container m-5">
      <Routes>
        <Route path="/" element={<AllNews/>}/>
        <Route path="/news" element={<AllNews/>}/>
        <Route path="/news/:newsId" element={<AllNews/>}/>
        <Route path="/news/addNews" element={<AddNews/>}/>
      </Routes>
    </div>
  </>;
};

export default App;