// andrews version

import React from 'react';
import NavBar from '../components/NavBar';

const Watchlist = () => {
  return (
    <>
      <NavBar />
      <div className="watchlist-container">
        <h1>Watchlist</h1>
      </div>
    </>
  );
};

export default Watchlist;

// Liams version
// import React, { useEffect, useState } from 'react';
// import NavBar from '../components/NavBar';

// const Watchlist = () => {
//   const [watchlist, setWatchlist] = useState([]);

//   useEffect(() => {
//     const userId = 1; // Replace with the actual logged-in user's ID
//     fetch(`/api/watchlist/${userId}`)
//       .then(response => response.json())
//       .then(data => setWatchlist(data))
//       .catch(error => console.error('Error fetching watchlist:', error));
//   }, []);

//   return (
//     <>
//       <NavBar />
//       <div className="watchlist-container">
//         <h1>Watchlist</h1>
//         <ul>
//           {watchlist.map(item => (
//             <li key={item.watchlist_id}>
//               <strong>{item.name}</strong> - {item.symbol}: ${item.curr_price}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </>
//   );
// };

// export default Watchlist;
