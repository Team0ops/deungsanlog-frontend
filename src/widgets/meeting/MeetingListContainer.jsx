// 상위 컴포넌트에서 검색 및 페이징 처리
import { useState, useEffect } from "react";
import MeetingSearchSection from "./MeetingSearchSection";
import MeetingCardList from "./MeetingCardList";
import axiosInstance from "shared/lib/axiosInstance";

const MeetingListContainer = () => {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("deadline");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMeetings = ({ status, sort, keyword, page }) => {
    axiosInstance
      .get("/meeting-service/search", {
        params: { status, sort, keyword, page },
      })
      .then((res) => {
        setMeetings(res.data.content);
        setTotalPages(res.data.totalPages);
        setPage(res.data.number);
      });
  };

  useEffect(() => {
    fetchMeetings({ status: filter, sort, keyword: searchKeyword, page });
    // eslint-disable-next-line
  }, []);

  const handleSearch = ({ status, sort, keyword, page }) => {
    fetchMeetings({ status, sort, keyword, page });
  };

  const handlePageChange = (newPage) => {
    fetchMeetings({
      status: filter,
      sort,
      keyword: searchKeyword,
      page: newPage,
    });
  };

  return (
    <>
      <MeetingSearchSection
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        onSearch={handleSearch}
      />
      <MeetingCardList
        meetings={meetings}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default MeetingListContainer;
