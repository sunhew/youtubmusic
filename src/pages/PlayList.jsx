import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { MusicPlayerContext } from '../context/MusicPlayerProvider';
import { toast } from 'react-toastify';

const Playlist = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState({ name: '', items: [] });
  const { playTrack, setPlaylist: setMusicPlaylist, addTrackToEnd, musicData } = useContext(MusicPlayerContext);

  useEffect(() => {
    const storedPlaylist = JSON.parse(localStorage.getItem(id)) || { name: '', items: [] };
    setPlaylist(storedPlaylist);
  }, [id]);

  const playPlaylist = () => {
    setMusicPlaylist([]); // 기존 플레이리스트 비우기
    playlist.items.forEach((track, index) => {
      addTrackToEnd(track);
      if (index === 0) {
        playTrack(0); // 첫 번째 트랙을 재생
      }
    });
    toast.success(`${playlist.name} 리스트를 전체 재생합니다`);
  };

  const handlePlayTrack = (track) => {
    const trackIndex = musicData.findIndex(t => t.videoID === track.videoID);
    if (trackIndex !== -1) { // 트랙이 이미 있는 경우
      playTrack(trackIndex);
    } else { // 트랙이 없는 경우
      addTrackToEnd(track);
      playTrack(musicData.length); // 추가한 트랙을 재생
    }
  };

  const handleAddTrack = (track) => {
    const targetPlaylistID = 'targetPlaylist'; // 추가할 플레이리스트 ID 설정
    const targetPlaylist = JSON.parse(localStorage.getItem(targetPlaylistID)) || { name: 'Target Playlist', items: [] };

    const trackExists = targetPlaylist.items.some(t => t.videoID === track.videoID);
    if (!trackExists) {
      targetPlaylist.items.push(track);
      localStorage.setItem(targetPlaylistID, JSON.stringify(targetPlaylist));
      toast.success(`${track.title}이(가) ${targetPlaylist.name}에 추가되었습니다.`);
    } else {
      toast.info(`${track.title}은(는) 이미 ${targetPlaylist.name}에 있습니다.`);
    }
  };

  return (
    <section id="playlist">
      {playlist.items.length > 0 ? (
        <>
          <h2>
            {`${playlist.name} 리스트`}
            <button id="playlist_playPlaylistButton" onClick={playPlaylist}>
              전체 재생
            </button>
          </h2>
          <div className="track-list-container">
            <ul>
              {playlist.items.map((track, index) => (
                <li key={index}>
                  <div className="track-info">
                    <div className="track-thumbnail">
                      <img src={track.imageURL} alt={track.title} />
                    </div>
                    <div className="track-details">
                      <div className="track-title" title={track.title}>{track.title}</div>
                      <div className="track-artist">{track.artist}</div>
                    </div>
                  </div>
                  <div className="track-actions">
                    <button onClick={() => handlePlayTrack(track)}>재생</button>
                    <button onClick={() => handleAddTrack(track)}>추가</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <section className='music-chart'>
          <div className="title">
            <h2>😜 {`${playlist.name}`}</h2>
          </div>
          <div className="list">
            <ul>
              <li>!!아직 리스트가 없습니다. 노래를 추가해주세요!</li>
            </ul>
          </div>
        </section>
      )}
    </section>
  );
}

export default Playlist;
