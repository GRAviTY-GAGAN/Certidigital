
<!-- PROJECT LOGO -->
<br />
<p align="center">
    <img src="/public/Images/Masailogo.svg" alt="Logo" width="120" >
</p>


<h1 align="center">Certidigital</h1>
<h3 align="center">
	<a href="https://certidigital.netlify.app/">Live URL</a>
</h3>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#artefacts">Artefacts</a></li>
        <li><a href="#backend-repo">Backend Repo</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#test-credentials">Test Credentials</a></li>
        <li><a href="#tools-and-libraries">Tools And Libraries</a></li>
      </ul>
    </li>
    <li><a href="#contributors">Contributors</a></li>
  </ol>
</details>

## About The Project

<div align="center">
    <img src="/public/Images/CertiDigital%20Hero%20Image.png" alt="Logo" width="100%" >
</div>

Previously, Masai School used to create certificates for students' achievements manually with the help of Google Sheets which consumed a lot of time. In order to overcome this dependency on Google Sheets and reduce manual efforts, we created a website so that the Masai School team could create certificates in bulk and send them to their respective student’s email.


### Artefacts

<a href="https://docs.google.com/document/d/1uM4GGe75thJbfEOWeETxDPJqJXx4b0xGXqwMeMfPz1c/edit?usp=sharing" target="_blank">PRD</a>
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://drive.google.com/file/d/1aRXc0VokWbwq7GoKljW-XSpPgIJpVxzw/view?usp=share_link" target="_blank">HLD</a>
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://pankaj1947.notion.site/CertiDigital-00d113f35afb4ad0957b15b6dfabbf50" target="_blank">Notion</a>

### Backend Repo

[Backend Repo](https://github.com/masai-builds/Certidigital-be)

**Mission:**

Admin will generates certificates for users for their achievements and sends them to their respective emails and student will view their certificates and they can share them on social media platforms. 

**Goals:**

- To reduce the manual efforts and dependency on google sheets.
- A seamless system for creating certificates for various achievements in Masai School.
- Provide an automated and fast system which handles the request in bulk.


**Features:**

Admin:
Sign up with Email and Password
Sign in with Email and Password
Store password in DB after hashing
Forgot Password option
Create a Sample Certificate with dummy data
Edit the created sample certificate
Upload CSV file which contains bulk data
Send certificates to all of the student's mail

Student :
Sign up with Email and Password
Sign in with Email and Password
Forgot Password option
View the certificates related to his/her
Share it on social media platforms


### Built With

<p align="center">
	<a href="https://ant.design/">
		<img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" title="Ant Design" height="70">
	</a>
	<a href="https://reactjs.org/">
		<img src="https://res.cloudinary.com/emarat/image/upload/h_150/v1631867520/react-logo_aiqchy.png" title="React" height="70">
	</a>
	<a href="https://redux.js.org/">
		<img src="https://res.cloudinary.com/emarat/image/upload/h_150/v1631867520/redux-logo_g2vd7e.png" title="Redux" height="70">
	</a>
	<a href="https://github.com/features/actions">
		<img src="https://res.cloudinary.com/emarat/image/upload/h_150/v1631867519/github-action-logo_yamrxz.png" title="Github Actions" height="70">
	</a>
	<a href="https://www.netlify.com/">
		<img src="https://res.cloudinary.com/emarat/image/upload/h_150/v1631867519/netlify-logo_i6ye1g.png" title="Netlify" height="60">
	</a>
	<a href="https://nodejs.org/en/">
		<img src="https://cdn-clekk.nitrocdn.com/tkvYXMZryjYrSVhxKeFTeXElceKUYHeV/assets/images/optimized/rev-54b50ac/wp-content/uploads/2020/12/node.js-logo-image-2048x1170.png" title="Nodejs" height="70">
	</a>
	<a href="https://expressjs.com/">
		<img src="https://geekflare.com/wp-content/uploads/2023/01/expressjs-680x220.png" title="ExpressJs" height="70">
	</a>
	<a href="https://jwt.io/">
		<img src="https://miro.medium.com/v2/resize:fit:720/format:webp/0*6VBPajn3pKDYkiuH.png" title="Jwt" height="70">
	</a>
	<a href="https://redis.io/">
		<img src="https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Redis_Logo.svg/200px-Redis_Logo.svg.png" title="redis" height="70">
	</a>
	<a href="https://www.mongodb.com">
		<img src="https://res.cloudinary.com/hevo/image/upload/f_auto,q_auto/v1626694700/hevo-blog/MongoDB-sm-logo-500x400-1-1.gif" title="MongoDB"      height="100">
	</a>
	<a href="https://swagger.io/">
		<img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Swagger-logo.png" title="Swagger" height="70">
	</a>
        <a href="https://www.npmjs.com/package/winston">
		<img src="https://avatars.githubusercontent.com/u/9682013?s=280&v=4" title="MongoDB" height="70">
	</a>
	<a href="https://railway.app">
		<img src="https://railway.app/brand/logo-dark.svg" title="Railway" height="70">
	</a>


</p>

<!-- GETTING STARTED -->

## Getting Started

Following are the simple steps to run this project.

### Prerequisites

- npm
  ```sh
  npm install 
  ```



### Installation

1. Clone the frontend repo
   ```sh
   git clone https://github.com/masai-builds/Certidigital-fe.git
   ```
2. Clone the backend repo
   ```sh
   git clone https://github.com/masai-builds/Certidigital-be.git 
   ```
3. Run
   ```sh
   npm start
   ```
4. Open http://localhost:3000 to view it in the browser 
5. Open http://localhost:8080 to backend run in the browser (npm run dev)




## Test Credentials

*To login in the app as admin use email demoAdmin@gmail.com and password Admin@123*  
*To login in the app as student use email demoStudent@gmail.com and password Student@123* 


## Tools and Libraries 

- [Redux] - State Management
- [Sentry] - Error Tracking
- [React-testing-Library] - Integration testing
- [AntDesign] - CSS styling classes
- [nodeJs] - Server environment
- [ExpressJs] - Routing, middleware
- [JWT] - JSON Web Token for authorization and authentication
- [Swagger] = API Developer tool
- [Winston] - App logging 
- [redis] - Response optimization 


## Contributors ✨
<table>
<tr>
    <td align="center">
        <a href="https://github.com/Pankaj1947">
            <img src="https://avatars.githubusercontent.com/u/96759314?v=4" width="100px;" alt="Pankaj1947"/>
            <br />
            <sub><b>Pankaj Kumar Ram</b></sub>
        </a>
        <br />
        <a href="https://github.com/Pankaj1947" title="GitHub">
	   <img src='https://ico.now.sh/github/fff' alt='github' height='15'>
	</a>
	<a href="mailto:pankajkr885@gmail.com" title="Gmail">
	   <img src='https://ico.now.sh/gmail/fff' alt='gmail' height='15'>
	</a>
	<a href="https://www.linkedin.com/in/pankaj-kumar-ram-639437190/" title="LinkedIn">
	   <img src='https://ico.now.sh/linkedin/fff' alt='linkedin' height='15'>
	</a>
    </td>  
      <td align="center">
        <a href="https://github.com/Saraswati121">
            <img src="https://avatars.githubusercontent.com/u/99686266?v=4" width="100px;" alt="Saraswati121"/>
            <br />
            <sub><b>Saraswati Panda</b></sub>
        </a>
        <br />
        <a href="https://github.com/Saraswati121" title="Github">
	   <img src='https://ico.now.sh/github/fff' alt='github' height='15'>
	</a>
	<a href="mailto:gouravmisra6@gmail.com" title="Gmail">
	   <img src='https://ico.now.sh/gmail/fff' alt='gmail' height='15'>
	</a>
	<a href="https://www.linkedin.com/in/saraswati-panda/" title="LinkedIn">
	   <img src='https://ico.now.sh/linkedin/fff' alt='linkedin' height='15'>
	</a>
    </td>  
    <td align="center">
        <a href="https://github.com/pratikganjale55">
            <img src="https://avatars.githubusercontent.com/u/100259765?v=4" width="100px;" alt="pratikganjale55"/>
            <br />
            <sub><b>Pratik Ganjale</b></sub>
        </a>
        <br />
        <a href="https://github.com/pratikganjale55" title="Github">
	   <img src='https://ico.now.sh/github/fff' alt='github' height='15'>
	</a>
	<a href="mailto:pratikganjale55@gmail.com" title="Gmail">
	   <img src='https://ico.now.sh/gmail/fff' alt='gmail' height='15'>
	</a>
	<a href="https://www.linkedin.com/in/pratik-ganjale-4920aa166/" title="LinkedIn">
	   <img src='https://ico.now.sh/linkedin/fff' alt='linkedin' height='15'>
	</a>
    </td>      
    <td align="center">
        <a href="https://github.com/Dhirja">
            <img src="https://avatars.githubusercontent.com/u/99707594?v=4" width="100px;" alt="Dhirja"/>
            <br />
            <sub><b>Dhiraj Dubey</b></sub>
        </a>
        <br />
        <a href="https://github.com/Dhirja" title="Github">
	   <img src='https://ico.now.sh/github/fff' alt='github' height='15'>
	</a>
	<a href="mailto:dhirajdubey19965@gmail.com" title="Gmail">
	   <img src='https://ico.now.sh/gmail/fff' alt='gmail' height='15'>
	</a>
	<a href="https://www.linkedin.com/in/dhiraj-dubey-aa92a1162/" title="LinkedIn">
	   <img src='https://ico.now.sh/linkedin/fff' alt='linkedin' height='15'>
	</a>
    </td>
  </tr>
  </table>
  
