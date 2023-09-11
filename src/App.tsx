import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import {
    // Alert,
    // Box,
    // Display,
    // DropdownMenu,
    // Pagination,
    // Tab,
    // TabList,
    // Tabs,
    ViewContainer
} from '@impact-market/ui';

import Home from './components/Home/Home';
import Header from './components/Header/Header';
import Level from './components/Level/Level';

import { useParams } from 'react-router-dom';

// import { useSinglePrismicDocument, useAllPrismicDocumentsByType } from '@prismicio/react';
import { DataProvider } from './context/DataContext';
import Lesson from './components/Lesson/Lesson';


const Test = () => {
    const { slug, uid } = useParams();

    return <div>{`Page of Lesson: ${slug} ${uid}`}</div>;
};

const App = () => {
    return (
        <BrowserRouter>
            <Header />
            <DataProvider >
                    <Routes>
                        <Route path="/" element={<Home />} />
                        {/* <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/guides" element={<Guides />} /> */}
                        <Route path="/:levelId/:uid" element={<Lesson />} />
                        <Route path="/:levelId" element={<Level />} />
                    </Routes>
            </DataProvider>
        </BrowserRouter>
    );
};

export default App;
