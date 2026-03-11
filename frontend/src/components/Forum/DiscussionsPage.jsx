import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForum } from "../Forum/ForumContext";

const DiscussionsPage = () => {
  const { categorySlug, subSlug } = useParams();
  const { discussions, loading, fetchDiscussions } = useForum();

  useEffect(() => {
    fetchDiscussions(categorySlug, subSlug);
  }, [categorySlug, subSlug]);

  if (loading) return <p>Loading discussions...</p>;

  return (
    <div>
      <h2>Discussions</h2>

      {discussions.length === 0 ? (
        <p>No discussions yet!</p>
      ) : (
        discussions.map((discussion) => (
          <div key={discussion._id}>
            <h3>{discussion.title}</h3>
            <p>{discussion.content.slice(0, 120)}...</p>
          </div>
        ))
      )}
    </div>
  );
};

export default DiscussionsPage;