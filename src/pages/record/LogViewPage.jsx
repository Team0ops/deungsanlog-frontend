import { useState, useEffect } from "react";
import LogHeader from "widgets/LogHeader/LogHeader";
import { Box } from "@mui/material";
import axios from "axios";
import RecordCard from "widgets/record/RecordCard";
import Grid from "@mui/material/Grid";

const LogViewPage = () => {
  const [sortOption, setSortOption] = useState("latest");
  const userId = 11;

  useEffect(() => {
    axios
      .get(`http://localhost:8080/record-service/get?userId=${userId}`)
      .then((res) => {
        const sorted = [...res.data].sort((a, b) => {
          return sortOption === "latest"
            ? new Date(b.recordDate) - new Date(a.recordDate)
            : new Date(a.recordDate) - new Date(b.recordDate);
        });
        setRecords(sorted);
      })
      .catch((err) => console.error("기록 불러오기 실패", err));
  }, [userId, sortOption]);

  const [records, setRecords] = useState([]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      ml="{-20}"
    >
      <LogHeader
        userId={userId}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      <br />
      <Grid
        container
        spacing={3}
        justifyContent="left"
        width="100%"
        alignItems="flex-start"
        mt={2}
        ml={-10}
      >
        {records.map((record) => (
          <Grid item key={record.id}>
            <RecordCard
              recordId={record.id} // recordId prop 추가
              image={
                record.photoUrl
                  ? `http://localhost:8080/record-service${record.photoUrl}`
                  : "/default-image.png"
              }
              title={record.mountainName}
              date={record.recordDate}
              content={record.content}
              onEdit={() => console.log("수정", record.id)}
              onDeleted={() => {
                setRecords((prev) => prev.filter((r) => r.id !== record.id));
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LogViewPage;
