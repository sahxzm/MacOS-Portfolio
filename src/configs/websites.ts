import type { WebsitesData } from "~/types";

const websites: WebsitesData = {
  favorites: {
    title: "Social Links",
    sites: [
      {
        id: "my-email",
        title: "Email",
        img: "img/sites/gmail.svg",
        link: "mailto:sahilsingh0322@gmail.com",
      },
      {
        id: "my-github",
        title: "Github",
        img: "img/sites/github.svg",
        link: "https://github.com/sahxzm",
      },
      {
        id: "my-linkedin",
        title: "Linkedin",
        img: "img/sites/linkedin.svg",
        link: "https://www.linkedin.com/in/sahil-singh-ba8b711b5/",
      },
      {
        id: "my-instagram",
        title: "Instagram",
        img: "img/sites/instagram.png",
        link: "https://www.instagram.com/sahxzm",
      },
      {
        id: "my-codechef",
        title: "CodeChef",
        img: "img/sites/codechef.png",
        link: "https://www.codechef.com/users/sahilsingh0322",
      },
    ],
  },
  freq: {
    title: "Frequently Visited",
    sites: [
      {
        id: "hacker-news",
        title: "Hacker News",
        img: "img/sites/hacker.svg",
        link: "https://news.ycombinator.com/",
      },
      {
        id: "github",
        title: "Github",
        img: "img/sites/github.svg",
        link: "https://github.com/",
      },
      {
        id: "leetcode",
        title: "LeetCode",
        img: "img/sites/leetcode.svg",
        link: "https://leetcode.com/",
      },
    ],
  },
};

export default websites;
