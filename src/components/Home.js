
function Home() {
    
    return(
        <div>
            
            <div>
                <div className="home-sec">
                <div className="home-row-text">
                <h2 className="home-slogan">From raw data to rich visuals:</h2>
                <h3 className="home-subslogan">see the world in color.</h3>
                </div>
                <img 
                    src="./assets/Life-expectancy-by-country.png"
                    className="home-Demo"
                    alt="map-life-expectancy"
                    >

                </img>

                <p className="home-description"><b>Design your own custom maps with our easy-to-use map generator! </b>

                <p>
                Choose from our selection of three maps: World Map, US States, and Europe. With our tool, you can set the title for your map and add or remove groups. Each group has its own title and color scheme, and you can select all the countries or states that belong in that group.
                </p>
               
                <p>
                Once you're happy with your map, you can download it as a PNG or JPEG file for use in presentations, reports, or any other project you have in mind. With more maps coming soon, our tool is perfect for anyone who needs to create custom visualizations for a wide variety of purposes.
                </p>
                
               
               </p>

        <div className="map-types">

        <div className="map-row">
        <img 
            src="./assets/world_map_demo.png"
            alt="world-map"

        ></img>
            
            <div>
            <p >
            <h3>World Map</h3>
            Our world map is the ultimate tool for creating custom maps of the entire planet. With 220 different countries, regions and islands to choose from, it's the largest map in our selection. Use it to create eye-catching infographics or just for fun.

            
            </p>

            <div>

            </div>
            <a href="/world-map">Create Map</a>

            </div>
          

        </div>

        <div className="map-row">
        <img 
            src="./assets/us_states_demo.png"
            alt="us-states"
            ></img>
            
            <div>
            <p >
            <h3>US States</h3>
            Our US States map is the perfect tool for visualizing data within the United States. With all 50 states included, you can create custom maps for any purpose, from business presentations to academic reports.

            
            </p>

            <div>
            <a href="/us-states">Create Map</a>

            </div>
            </div>
          

        </div>

        <div className="map-row">
        <img 
            src="./assets/europe_map_demo.png"
            alt="europe"
        
        ></img>
            
            <div>
            <p >
            <h3>Europe</h3>
            Our Europe map is the ideal tool for visualizing data within the continent of Europe. With all 44 European nations included, you can create custom maps for any purpose. Additionally, the map includes some non-European countries that have strong relations with the continent. This comprehensive map provides a clear and detailed view of the European continent and its surrounding regions.

            
            </p>

            <div>
            <a href="/europe">Create Map</a>

            </div>
            </div>
          

        </div>
            
            <h3>More maps coming soon!</h3>
         
        </div>
               
               
                
                </div>
                
                {/* // Welcome to my map generator project! I created this website as an individual and it's completely free for everyone to use. I love data and maps, and I noticed that there are a lot of great maps online that people are using to share interesting insights and stories. However, I never knew how to create my own map, so I decided to build this website to help people like me. */}

                {/* If you have any feedback or suggestions, please don't hesitate to get in touch with me. Also, if you're interested in contributing to the project, it's available on GitHub. Thank you for using my map generator tool! */}
            </div>
        </div>
    )
}

export default Home