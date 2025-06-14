import styles from "./CommunityLayout.module.css";
import KingOfMountainWidget from "widgets/community/Rank/KingOfMountainWidget";
import HotMountainList from "widgets/community/HotMountain/HotMountainList";

const userId = null;

const CommunityPage = () => {
  return (
    <div className={styles.container}>
      <KingOfMountainWidget userId={userId} />
      <HotMountainList />
    </div>
  );
};

export default CommunityPage;
