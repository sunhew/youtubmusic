import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MusicPlayerContext } from '../context/MusicPlayerProvider';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdOutlinePlayCircleFilled, MdFormatListBulletedAdd, MdHive } from 'react-icons/md';
import Modal from './Modal';

const SearchResults = () => {
    const { searchID } = useParams();
    const { addTrackToList, addTrackToEnd, playTrack } = useContext(MusicPlayerContext);

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const searchResultsRef = useRef(null);

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                    params: {
                        part: 'snippet',
                        q: searchID,
                        maxResults: 15,
                        key: process.env.REACT_APP_YOUTUBE_API_KEY,
                    },
                });
                setVideos(response.data.items);
                setNextPageToken(response.data.nextPageToken);
            } catch (error) {
                console.error('Failed to fetch videos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, [searchID]);

    const loadMoreVideos = async () => {
        if (!nextPageToken) return;

        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: searchID,
                    maxResults: 5,
                    pageToken: nextPageToken,
                    key: process.env.REACT_APP_YOUTUBE_API_KEY,
                },
            });
            setVideos((prevVideos) => [...prevVideos, ...response.data.items]);
            setNextPageToken(response.data.nextPageToken);
        } catch (error) {
            console.error('Failed to fetch more videos:', error);
        }
    };

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
        setOverlayVisible(true);
    };

    const handlePlayNow = (video) => {
        const newTrack = {
            title: video.snippet.title,
            videoID: video.id.videoId,
            imageURL: video.snippet.thumbnails.default.url,
            artist: video.snippet.channelTitle,
            rank: 1
        };
        addTrackToList(newTrack);
        playTrack(0);
        setOverlayVisible(false);
    };

    const handleAddToList = (result) => {
        const newTrack = {
            title: result.snippet.title,
            videoID: result.id.videoId,
            imageURL: result.snippet.thumbnails.default.url,
            artist: result.snippet.channelTitle,
            rank: 1
        };
        const added = addTrackToEnd(newTrack);
        if (added) {
            toast.success('해당 곡을 리스트에 추가했어요. 중복곡은 제외됩니다.');
        } else {
            toast.info('해당 곡을 리스트에 추가했어요. 중복곡은 제외됩니다.');
        }
        setOverlayVisible(false);
    };

    const handleAddToPlaylistClick = (result) => {
        setSelectedTrack({
            title: result.snippet.title,
            videoID: result.id.videoId,
            imageURL: result.snippet.thumbnails.default.url,
            artist: result.snippet.channelTitle,
            rank: 1
        });
        setIsModalOpen(true);
    };

    const handleAddToPlaylist = (playlistId) => {
        const playlist = JSON.parse(localStorage.getItem(playlistId));
        if (playlist && selectedTrack) {
            playlist.items.push(selectedTrack);
            localStorage.setItem(playlistId, JSON.stringify(playlist));
        }
    };

    const handleScroll = () => {
        const scrollTop = searchResultsRef.current.scrollTop;
        const scrollHeight = searchResultsRef.current.scrollHeight - searchResultsRef.current.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        searchResultsRef.current.style.setProperty('--scroll-percent', `${scrollPercentage}%`);
    };

    useEffect(() => {
        const searchElement = searchResultsRef.current;
        searchElement.addEventListener('scroll', handleScroll);
        return () => {
            searchElement.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
                setOverlayVisible(false);
            }
        };

        if (overlayVisible) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [overlayVisible]);

    return (
        <div className="search-results" ref={searchResultsRef}>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <h3>검색어 "{searchID}"에 대한 결과입니다.</h3>
                    <ul>
                        {videos.map((video, index) => (
                            <li key={index} onClick={() => handleVideoClick(video)}>
                                <span className='img' style={{ backgroundImage: `url(${video.snippet.thumbnails.default.url})` }}></span>
                                <span className='title'>{video.snippet.title}</span>
                                <span className='channel'>{video.snippet.channelTitle}</span>
                                {overlayVisible && selectedVideo === video && (
                                    <div className="overlay">
                                        <div className="overlay-content">
                                            <span className='playNow' onClick={() => handlePlayNow(video)}>
                                                <MdOutlinePlayCircleFilled /><span className='ir'>노래듣기</span>
                                            </span>
                                            <span className='listAdd' onClick={() => handleAddToList(video)}>
                                                <MdFormatListBulletedAdd /><span className='ir'>리스트 추가하기</span>
                                            </span>
                                            <span className='chartAdd' onClick={() => handleAddToPlaylistClick(video)}>
                                                <MdHive /><span className='ir'>나의 리스트에 추가하기</span>
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    <ToastContainer />
                    {nextPageToken && (
                        <div className="load-more">
                            <button onClick={loadMoreVideos}>더보기</button>
                        </div>
                    )}
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onAddToPlaylist={handleAddToPlaylist}
                    />
                </>
            )}
        </div>
    );
};

export default SearchResults;
