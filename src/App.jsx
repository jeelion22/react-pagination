import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [pageCount, setPageCount] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  let limit = 12;

  useEffect(() => {
    const getComments = async () => {
      const res = await fetch(
        // `http://localhost:3004/comments?_page=1&_limit=${limit}`
        `https://jsonplaceholder.typicode.com/comments?_page=1&_limit=${limit}`
      );
      const data = await res.json();
      const total = res.headers.get("x-total-count");
      // console.log(total);
      setPageCount(Math.ceil(total / limit));

      setItems(data);
      setLoading(false);
    };

    getComments();
  }, [limit]);

  const fetchComments = async (currentPage) => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/comments?_page=${currentPage}&_limit=${limit}`
    );
    const data = await res.json();
    setLoading(false);
    return data;
  };

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;

    const commentsFromServer = await fetchComments(currentPage);

    setItems(commentsFromServer);
  };

  return (
    <>
      {loading ? (
        <div className="container">
          <div className="row">
            <div className="col">
              <FontAwesomeIcon
                icon={faSpinner}
                fontSize="40"
                color="darkblue"
                spinPulse
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="container">
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {items.map((item) => (
                <div class="col">
                  <div class="card h-100">
                    <div class="card-body">
                      <h5 class="card-title">id: {item.id}</h5>
                      <h5 class="card-title">{item.name}</h5>
                      <h6 class="card-title">{item.email}</h6>
                      <p class="card-text">{item.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName="pagination justify-content-center mt-2"
            pageLinkClassName="page-link"
            pageClassName="page-item"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            activeClassName="active"
          />
        </>
      )}
    </>
  );
}

export default App;
