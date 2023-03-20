function Home() {
    return(
        <div>
            <div>
                <div className="home-row">
                <div className="home-row-text">
                <h2 className="home-slogan">From raw data to rich visuals:</h2>
                <h3 className="home-subslogan">see the world in color.</h3>
                </div>
                <img 
                    src="./assets/Life-expectancy-by-country.png"
                    className="home-Demo">

                </img>

                <p className="home-description">Design your own custom maps with our easy-to-use map generator! 

                <p>
                Choose from our selection of three maps: World Map, US States, and Europe. With our tool, you can set the title for your map and add or remove groups. Each group can have its own title and color scheme, and you can select all the countries or states that belong in that group.
                </p>
               
                <p>
                Once you're happy with your map, you can download it as a PNG or JPEG file for use in presentations, reports, or any other project you have in mind. With more maps coming soon, our tool is perfect for anyone who needs to create custom visualizations for a wide variety of purposes.
                </p>
                
                <p>
                And the best part? It's all completely free!
                </p>
               </p>

               <h2>Maps</h2>

               <h3>World Map</h3>
               <p>
               Our world map is the ultimate tool for creating custom maps of the entire planet. With 220 different countries and islands to choose from, it's the largest map in our selection. Use it to create eye-catching infographics or just for fun.
               </p>

               <h3>US States</h3>
               <p>
               Our US States map is the perfect tool for visualizing data within the United States. With all 50 states included, you can create custom maps for any purpose, from business presentations to academic reports.
               </p>

               <h3>Europe</h3>
               <p>
               Our Europe map is a great tool for exploring the continent and highlighting your favorite countries. And with some non-European countries that have strong ties to Europe included, you can create custom maps that show the relationships between different regions of the world.
               </p>
               
                
                </div>
                
                {/* // Welcome to my map generator project! I created this website as an individual and it's completely free for everyone to use. I love data and maps, and I noticed that there are a lot of great maps online that people are using to share interesting insights and stories. However, I never knew how to create my own map, so I decided to build this website to help people like me. */}

                {/* If you have any feedback or suggestions, please don't hesitate to get in touch with me. Also, if you're interested in contributing to the project, it's available on GitHub. Thank you for using my map generator tool! */}
            </div>
        </div>
    )
}

export default Home