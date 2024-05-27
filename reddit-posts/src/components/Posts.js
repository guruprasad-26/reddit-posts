import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Link,
  Container,
  Grid,
  Button,
} from "@mui/material";
import DOMPurify from "dompurify";
import "../App.css";

// Utility function to decode HTML entities
function decodeHTMLEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("https://www.reddit.com/r/reactjs.json")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.data.children);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Reddit ReactJS Posts
      </Typography>
      <Grid container spacing={3}>
        {posts.map((post) => {
          const rawHTML = post.data.selftext_html || "No content";
          const decodedHTML = decodeHTMLEntities(rawHTML);
          const sanitizedHTML = decodedHTML
            .replace(/<!--\s*SC_OFF\s*-->/g, "")
            .replace(/<!--\s*SC_ON\s*-->/g, "");

          return (
            <Grid item xs={12} sm={6} md={4} key={post.data.id}>
              <RedditCard
                title={post.data.title}
                content={sanitizedHTML}
                url={post.data.url}
                score={post.data.score}
              />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}

function RedditCard({ title, content, url, score }) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <Card className="card">
      <CardContent>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              expanded ? content : content.substring(0, 200) + "..."
            ),
          }}
          className={expanded ? "" : "truncated"}
        ></Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={toggleExpanded}>
          {expanded ? "Show Less" : "Show More"}
        </Button>
        <Link href={url} target="_blank" rel="noopener">
          Read more
        </Link>
        <Typography variant="body2" color="textPrimary">
          Score: {score}
        </Typography>
      </CardActions>
    </Card>
  );
}

export default Posts;
