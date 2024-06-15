import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const MusicPlayerContext = createContext();

const MusicPlayerProvider = ({ children }) => {
    const [musicData, setMusicData] = useState([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [played, setPlayed] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isShuffling, setIsShuffling] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/SeonHwa.json');
                const data = await response.json();
                setMusicData(data);
                console.log(data);
            } catch (error) {
                console.error('데이터를 가져오는데 실패했습니다.', error);
            }
        };
        fetchData();
    }, []);

    const playTrack = (index) => {
        setCurrentTrackIndex(index);
        setIsPlaying(true);
        setPlayed(0);
    };

    const pauseTrack = () => {
        setIsPlaying(false);
    };

    const nextTrack = () => {
        if (isShuffling) {
            setCurrentTrackIndex(Math.floor(Math.random() * musicData.length));
        } else {
            setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % musicData.length);
        }
        setIsPlaying(true);
        setPlayed(0);
    };

    const prevTrack = () => {
        setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + musicData.length) % musicData.length);
        setIsPlaying(true);
        setPlayed(0);
    };

    const updatePlayed = (played) => {
        setPlayed(played);
    };

    const updateDuration = (duration) => {
        setDuration(duration);
    };

    const toggleShuffle = () => {
        setIsShuffling(!isShuffling);
    };

    const toggleRepeat = () => {
        setIsRepeating(!isRepeating);
    };

    const handleTrackEnd = () => {
        if (isRepeating) {
            setPlayed(0);
            setIsPlaying(true);
        } else {
            nextTrack();
        }
    };

    // 재생 목록에 트랙을 추가하는 함수
    const addTrackToList = (track) => {
        setMusicData((prevMusicData) => [track, ...prevMusicData]);
    };

    // 재생 목록의 끝에 트랙을 추가하는 함수
    const addTrackToEnd = (track) => {
        const isDuplicate = musicData.some((existingTrack) => existingTrack.videoID === track.videoID);
        if (isDuplicate) {
            toast.info('해당 곡을 리스트에 추가했어요. 중복곡은 제외됩니다.');
            return false;
        }
        setMusicData((prevMusicData) => [...prevMusicData, track]);
        toast.success('현재 플레이 리스트에 추가했습니다.');
        return true;
    };

    return (
        <MusicPlayerContext.Provider
            value={{
                musicData,
                currentTrackIndex,
                isPlaying,
                played,
                duration,
                playTrack,
                pauseTrack,
                prevTrack,
                updatePlayed,
                updateDuration,
                isShuffling,
                toggleShuffle,
                isRepeating,
                toggleRepeat,
                handleTrackEnd,
                addTrackToList,
                addTrackToEnd
            }}>
            {children}
        </MusicPlayerContext.Provider>
    )
}

export default MusicPlayerProvider;
