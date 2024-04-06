import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import Post from "../components/Post";
import Suggestionbar from "../components/Suggestionbar";
import Contract from "../Contract.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import RefreshIcon from "@mui/icons-material/Refresh";

function Home() {
  const [posts, setPosts] = useState([]);

  async function handleReadPost() {
    let openCircleContract;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const chainId = await provider
      .getNetwork()
      .then((network) => network.chainId);

    if (chainId === 80001) {
      openCircleContract = {
        contractAddress: Contract.MumbaiContractAddress,
        contractAbi: Contract.abi,
      };
    } else if (chainId === 8082) {
      openCircleContract = {
        contractAddress: Contract.ShardeumContractAddress,
        contractAbi: Contract.abi,
      };
    } else {
      openCircleContract = {
        contractAddress: Contract.GoerliContractAddress,
        contractAbi: Contract.abi,
      };
    }

    const contract = new ethers.Contract(
      openCircleContract.contractAddress,
      openCircleContract.contractAbi,
      provider
    );

    const allPost = await contract.readPosts();
    setPosts(allPost);
  }

  useEffect(() => {
    handleReadPost();
  }, []);

  function refresh() {
    window.location.reload();
  }
  return (
    <>
      <Header />
      <div className="main">
        <LeftSidebar />
        <div className="post-container container">
          {posts.length === 0 ? (
            <div className="warning">
              <span onClick={refresh}>
                <RefreshIcon
                  style={{
                    transform: "scale(2)",
                    margin: "1.5rem",
                    cursor: "pointer",
                  }}
                />
              </span>
              <br />
              <span style={{ cursor: "pointer" }}>No Posts Yet...</span>
            </div>
          ) : (
            posts
              .slice(0)
              .reverse()
              .map((post, index) => {
                return (
                  <Post
                    key={index}
                    id={Number(post.postId)}
                    creatorAddress={post.creatorAddress}
                    addressOfImage={post.imageAddress}
                    postCaption={post.postCaption}
                    dateCreated={post.timeCreated}
                  />
                );
              })
          )}
        </div>
        <Suggestionbar />
      </div>
    </>
  );
}

export default Home;
