import React, { useEffect, useRef, useState, useContext } from 'react';
import { MusicPlayerContext } from '../context/MusicPlayerProvider';
import { toast } from 'react-toastify';

const Home = () => {
  const [playlists, setPlaylists] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const searchResultsRef = useRef(null);
  const { playTrack, setPlaylist, addTrackToEnd } = useContext(MusicPlayerContext);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const playlistFiles = [
        'Byunghyun.json', 'Daewon.json', 'hyeji_list.json', 'jieun_list.json', 'kimjw_list.json',
        'music_list.json', 'SeonHwa.json', 'seoyeon.json', 'Sohyun.json', 'SONG.json',
        'yihyun.json', 'yoon_list.json'
      ];
      const loadedPlaylists = [];

      for (let file of playlistFiles) {
        const response = await fetch(`/data/${file}`);
        const data = await response.json();
        loadedPlaylists.push({ name: file.replace('.json', ''), items: data });
      }

      setPlaylists(loadedPlaylists);
    };

    fetchPlaylists();
  }, []);

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

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const handlePlayPlaylist = (playlist) => {
    setPlaylist([]); // 기존 플레이리스트 비우기
    playlist.items.forEach((track, index) => {
      addTrackToEnd(track);
      if (index === 0) {
        playTrack(0); // 첫 번째 트랙을 재생
      }
    });
    toast.success(`${playlist.name}을(를) 재생 목록에 추가했어요`);
  };

  return (
    <section id="home" ref={searchResultsRef} className="home">
      <h2><em>12개</em>의 추천 플레이 리스트</h2>
      <div className="playlist-container">
        {playlists.map((playlist, index) => (
          <div key={index} className={`playlist ${expanded === index ? 'expanded' : ''}`}>
            <h3 onClick={() => toggleExpand(index)}>
              {playlist.name}
              <button className="play-all-button" onClick={() => handlePlayPlaylist(playlist)}>전체 재생</button>
            </h3>
            {expanded === index && (
              <ul>
                {playlist.items.map((track, trackIndex) => (
                  <li key={trackIndex}>
                    {track.title} - {track.artist}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Home;
