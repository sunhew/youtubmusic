import React, { forwardRef, useContext, useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import Modal from './Modal';

import { FcCalendar } from 'react-icons/fc';
import { MdFormatListBulletedAdd, MdOutlinePlayCircleFilled, MdClose, MdHive } from 'react-icons/md';
import { MusicPlayerContext } from '../context/MusicPlayerProvider';
import { ToastContainer, toast } from 'react-toastify';

const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button onClick={onClick} ref={ref}>
        <FcCalendar size={24} />
        <span>{value}</span>
    </button>
));

const Chart = ({ title, showCalendar, selectedDate, onDateChange, minDate, maxDate, data }) => {
    const { addTrackToList, addTrackToEnd, playTrack, musicData } = useContext(MusicPlayerContext);
    const chartRef = useRef(null);

    const [youtubeResults, setYoutubeResults] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);

    const searchYoutube = async (query) => {
        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: query,
                    type: 'video',
                    maxResults: 5,
                    key: process.env.REACT_APP_YOUTUBE_API_KEY,
                },
            });
            setYoutubeResults(response.data.items);
        } catch (error) {
            console.error('YouTube 검색에 실패했습니다.', error);
        }
    };

    const handleItemClick = (title) => {
        setSelectedTitle(title);
        searchYoutube(title);
    };

    const handlePlayNow = (result) => {
        const trackIndex = musicData.findIndex(track => track.videoID === result.id.videoId);
        if (trackIndex !== -1) {
            playTrack(trackIndex);
        } else {
            const newTrack = {
                title: result.snippet.title,
                videoID: result.id.videoId,
                imageURL: result.snippet.thumbnails.default.url,
                artist: result.snippet.channelTitle,
                rank: 1
            };
            if (addTrackToList(newTrack)) {
                playTrack(0);
            }
        }
    };

    const handleAddToList = (result) => {
        const newTrack = {
            title: result.snippet.title,
            videoID: result.id.videoId,
            imageURL: result.snippet.thumbnails.default.url,
            artist: result.snippet.channelTitle,
            rank: 1
        };
        const isDuplicate = musicData.some(track => track.videoID === newTrack.videoID);
        if (isDuplicate) {
            toast.info('해당 곡을 리스트에 추가했어요. 중복곡은 제외됩니다.');
        } else {
            addTrackToEnd(newTrack);
            toast.success('현재 플레이 리스트에 추가했습니다.');
        }
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
            const isDuplicate = playlist.items.some(track => track.videoID === selectedTrack.videoID);
            if (!isDuplicate) {
                playlist.items.push(selectedTrack);
                localStorage.setItem(playlistId, JSON.stringify(playlist));
                toast.success(`${playlist.name}에 곡을 추가했어요. 중복 곡은 제외됩니다.`);
            } else {
                toast.info(`${playlist.name}에 곡을 추가했어요. 중복 곡은 제외됩니다.`);
            }
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = chartRef.current.scrollTop;
            const scrollHeight = chartRef.current.scrollHeight - chartRef.current.clientHeight;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            const scrollbarThumb = chartRef.current.querySelector('::-webkit-scrollbar-thumb');
            if (scrollbarThumb) {
                scrollbarThumb.style.backgroundPosition = `0% ${scrollPercentage}%`;
            }
        };

        const chartElement = chartRef.current;
        chartElement.addEventListener('scroll', handleScroll);

        return () => {
            chartElement.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <section className='music-chart' ref={chartRef}>
                <ToastContainer />
                <div className="title">
                    <h2>{title}</h2>
                    {showCalendar && (
                        <div className='date'>
                            <DatePicker
                                selected={selectedDate}
                                onChange={onDateChange}
                                dateFormat="yyyy-MM-dd"
                                minDate={minDate}
                                maxDate={maxDate}
                                customInput={<CustomInput />}
                            />
                        </div>
                    )}
                </div>
                <div className="list">
                    <ul>
                        {data.map((item, index) => (
                            <li key={index} onClick={() => handleItemClick(item.title)}>
                                <span className='rank'>#{item.rank}</span>
                                <span className='img' style={{ backgroundImage: `url(${item.imageURL})` }}></span>
                                <span className='title'>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
            {youtubeResults.length > 0 && (
                <section className='youtube-result'>
                    <h3>"{selectedTitle}"에 대한 유튜브 검색 결과입니다.</h3>
                    <ul>
                        {youtubeResults.map((result, index) => (
                            <li key={index}>
                                <span className='img' style={{ backgroundImage: `url(${result.snippet.thumbnails.default.url})` }}></span>
                                <span className='title'>{result.snippet.title}</span>
                                <span className='playNow' onClick={() => handlePlayNow(result)}>
                                    <MdOutlinePlayCircleFilled /><span className='ir'>노래듣기</span>
                                </span>
                                <span className='listAdd' onClick={() => handleAddToList(result)}>
                                    <MdFormatListBulletedAdd /><span className='ir'>리스트 추가하기</span>
                                </span>
                                <span className='chartAdd' onClick={() => handleAddToPlaylistClick(result)}>
                                    <MdHive /><span className='ir'>나의 리스트에 추가하기</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                    <span className='close' onClick={() => setYoutubeResults([])}><MdClose /></span>
                </section>
            )}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddToPlaylist={handleAddToPlaylist}
            />
        </>
    );
};

export default Chart;
