import React, { useState, useEffect } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import NavigationBar from "./components/NavigationBar";
import Instruction from './components/NewsCards/Instruction';
import NewNews from './components/NewsCards/NewNews';
import NewsCards from './components/NewsCards/NewsCards';
import { Form, Button, FormControl} from "react-bootstrap/cjs";
import { trackPromise } from 'react-promise-tracker';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
const alanKey = process.env.REACT_APP_ALAN_API_KEY;

const App = () => {
    const [newsArticles, setNewsArticles] = useState([]);
    const [bingnews, setBingNews] = useState(null);
    const [track,setTrack] = useState(0);
    const [query, setQuery] = useState();
    useEffect(() => {
        alanBtn({
            key: alanKey,
            onCommand: ({command, articles}) => {
                if(command === 'goBack'){
                    setTrack(0);
                }
                else if(command === 'newHeadlines'){
                   
                    setTrack(1);
                    setNewsArticles(articles);
                }
                else if(command === 'xyz'){
                    setTrack(2);
                    searchNews(articles).then(setBingNews);
                }
                
            }
        })
    }, [])
    
    const search = (e) => {
        searchNews(query).then(setBingNews);
        setTrack(2);
    };

    async function searchNews(q) {
        q = encodeURIComponent(q);
        
            const response = await trackPromise(
                fetch(`https://rapidapi.p.rapidapi.com/news/search?count=50&setLang=IN&freshness=Week&textFormat=Raw&safeSearch=Off&q=${q}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "bing-news-search1.p.rapidapi.com",
                    "x-rapidapi-key": process.env.REACT_APP_RAPID_API_KEY,
                    "x-bingapis-sdk": "true"
                }
                })
                );
            const body = await response.json();
        
        return body.value;
      }      
    return (
        <div  style={{backgroundColor:"white"}}>
            <NavigationBar/> <br/>
            <Form inline className="container searchBar">
                <FormControl type="text" placeholder="Search News" className="m-2" value={query} onChange={e => setQuery(e.target.value)}/>
                <Button variant="outline-info" className="m-2" onClick={search}>Search</Button>
            </Form>
            
            <br/>
            {
                track === 0 ? <Instruction/> :null
            }
            {!newsArticles ? null
                :track === 1 && newsArticles.length !== 0
                    ? <NewsCards articles={newsArticles} />
                    : null
            }
           
            {!bingnews ? null
                :track === 2 && bingnews.length !== 0
                    ? <NewNews articles={bingnews}/>
                    : <i>No Result</i>
            }


            
        </div>
    )   
}
export default App;