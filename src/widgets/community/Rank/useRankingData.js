// useRankingData.js
import { useEffect, useRef, useState } from "react";
import axiosInstance from "shared/lib/axiosInstance";

const useRankingData = (userId) => {
  const [topRankers, setTopRankers] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef(null);

  const fetchRanking = () => {
    setLoading(true);
    axiosInstance
      .get(`/record-service/rankings${userId ? `?userId=${userId}` : ""}`)
      .then((res) => {
        setTopRankers(res.data.topRankers || []);
        setMyRank(res.data.myRank || null);
      })
      .catch(() => {
        setTopRankers([]);
        setMyRank(null);
      })
      .finally(() => {
        setLoading(false);
        timeoutRef.current = setTimeout(fetchRanking, 60000);
      });
  };

  useEffect(() => {
    fetchRanking();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [userId]);

  const handleManualRefresh = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    fetchRanking();
  };

  return { topRankers, myRank, loading, handleManualRefresh };
};

export default useRankingData;
