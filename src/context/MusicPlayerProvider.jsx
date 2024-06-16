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
    const [isRepeating, setIsRepeating] = useState(0); // 0: No repeat, 1: Repeat one, 2: Repeat all
    const [playedTracks, setPlayedTracks] = useState([]); // To track played songs in shuffle mode
    const [playlist, setPlaylist] = useState([]); // 추가된 부분: 사용자 플레이리스트
    const [volume, setVolume] = useState(0.8); // 볼륨 상태 추가

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
        if (isShuffling) {
            setPlayedTracks([index]); // Start tracking played tracks in shuffle mode
        }
    };

    const pauseTrack = () => {
        setIsPlaying(false);
    };

    const nextTrack = () => {
        if (isShuffling) {
            let nextIndex;
            const unplayedTracks = musicData.map((_, idx) => idx).filter(idx => !playedTracks.includes(idx));
            if (unplayedTracks.length === 0) {
                if (isRepeating === 2) {
                    setPlayedTracks([]);
                    nextIndex = Math.floor(Math.random() * musicData.length);
                } else {
                    setIsPlaying(false);
                    return;
                }
            } else {
                nextIndex = unplayedTracks[Math.floor(Math.random() * unplayedTracks.length)];
            }
            setCurrentTrackIndex(nextIndex);
            setPlayedTracks(prev => [...prev, nextIndex]);
        } else {
            setCurrentTrackIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % musicData.length;
                if (nextIndex === 0 && isRepeating !== 2) {
                    setIsPlaying(false);
                    return prevIndex;
                }
                return nextIndex;
            });
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
        setPlayedTracks([]);
    };

    const toggleRepeat = () => {
        setIsRepeating((prev) => (prev + 1) % 3); // Toggle through 0, 1, 2
    };

    const handleTrackEnd = () => {
        if (isRepeating === 1) {
            setPlayed(0);
            setIsPlaying(true);
        } else {
            nextTrack();
        }
    };

    const addTrackToList = (track) => {
        const exists = musicData.some((t) => t.videoID === track.videoID);
        if (!exists) {
            setMusicData((prevMusicData) => [track, ...prevMusicData]);
            toast.success('현재 플레이 리스트에 추가했습니다.');
            return true;
        } else {
            toast.info('해당 곡을 리스트에 추가했어요. 중복곡은 제외됩니다.');
            return false;
        }
    };

    const addTrackToEnd = (track) => {
        const exists = musicData.some((t) => t.videoID === track.videoID);
        if (!exists) {
            setMusicData((prevMusicData) => [...prevMusicData, track]);
            return true;
        } else {
            toast.info('해당 곡을 리스트에 추가했어요. 중복곡은 제외됩니다.');
            return false;
        }
    };

    const clearPlaylist = () => {
        setMusicData([]);
        toast.success('플레이 리스트가 비워졌습니다.');
    };

    const removeTrack = (index) => {
        setMusicData((prevMusicData) => prevMusicData.filter((_, i) => i !== index));
        toast.success('곡이 플레이 리스트에서 삭제되었습니다.');
    };

    // 추가된 함수: 사용자 플레이리스트에 트랙 추가
    const addToUserPlaylist = (track) => {
        const exists = playlist.some((t) => t.videoID === track.videoID);
        if (!exists) {
            setPlaylist((prevPlaylist) => [...prevPlaylist, track]);
            toast.success(`${track.title}를 사용자 플레이리스트에 추가했습니다.`);
        } else {
            toast.info('해당 곡은 이미 플레이리스트에 있습니다.');
        }
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
                nextTrack,
                updatePlayed,
                updateDuration,
                isShuffling,
                toggleShuffle,
                isRepeating,
                toggleRepeat,
                handleTrackEnd,
                addTrackToList,
                addTrackToEnd,
                clearPlaylist,
                removeTrack,
                playlist,           // 사용자 플레이리스트 추가
                addToUserPlaylist,  // 사용자 플레이리스트에 트랙 추가 함수 제공
                setPlaylist,        // 사용자 플레이리스트 설정 함수 제공
                volume,             // 볼륨 추가
                updateVolume: setVolume // 볼륨 업데이트 함수 제공
            }}>
            {children}
        </MusicPlayerContext.Provider>
    );
}

export default MusicPlayerProvider;
