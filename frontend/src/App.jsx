import MoviesList from "./home/MoviesList";
import { Route, Routes } from "react-router-dom";
import MovieDetail from "./movies/MovieDetail";
import TheatersList from "./theaters/TheatersList";
import MoviesIndex from "./movies/MoviesIndex";
import TheaterDetail from "./theaters/TheaterDetail";
import Nav from "./components/Nav";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="container py-6 flex-grow">
            <Routes>
                <Route exact path="/" element={<MoviesList />} />
                <Route path="/movies" element={<MoviesIndex />} />
                <Route path="/movies/:id" element={<MovieDetail />} />
                <Route exact path="/theaters" element={<TheatersList />} />
                <Route path="/theaters/:id" element={<TheaterDetail />} />
            </Routes>
        </main>
        <footer className="
                    border-t border-zinc-400 dark:border-zinc-800
                    bg-zinc-200/60 dark:bg-zinc-900/60
                    py-6 text-center text-sm text-zinc-500 mt-auto">
            <p>We Love Movies</p>
            <br></br>
            <p>Built and designed by Francisco Alvarado</p>
            <br></br>
            <p>All rights reserved ©</p>
        </footer>
    </div>
  );
}

export default App;
