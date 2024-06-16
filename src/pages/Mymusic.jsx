import React, { useContext } from 'react';
import useFetchData from '../hook/useFetchData';
import { MusicPlayerContext } from '../context/MusicPlayerProvider';

import Loading from '../components/Loading';
import Error from '../components/Error';
import { toast } from 'react-toastify';

const Mymusic = () => {
  const { data, loading, error } = useFetchData('./data/SeonHwa.json');
  const { playTrack, setPlaylist, addTrackToEnd, addTrackToList } = useContext(MusicPlayerContext);

  if (loading) return <Loading loading={loading} />;
  if (error) return <Error message={error.message} />;

  const playPlaylist = () => {
    setPlaylist([]); // 기존 플레이리스트 비우기
    data.forEach((track, index) => {
      addTrackToEnd(track);
      if (index === 0) {
        playTrack(0); // 첫 번째 트랙을 재생
        toast.success('로하의 음악 리스트를 전체 재생합니다');
      }
    });
    toast.success('로하의 음악 리스트를 전체 재생합니다');
  };

  const handlePlayTrack = (track) => {
    if (!addTrackToList(track)) { // addTrackToList returns false if the track already exists
      playTrack(data.findIndex(t => t.videoID === track.videoID));
    } else {
      playTrack(data.length - 1); // Play the newly added track
    }
  };

  const handleAddTrack = (track) => {
    if (addTrackToEnd(track)) {
      toast.success('트랙이 플레이리스트에 추가되었습니다');
    }
  };

  return (
    <section id='Mymusic_myMusic'>
      <h2>
        🎵 로하의 음악 리스트
        <button id='Mymusic_playPlaylistButton' onClick={playPlaylist}>
          전체 재생
        </button>
      </h2>
      <div className="track-list-container">
        <ul>
          {data.map((track, index) => (
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
    </section>
  );
}

export default Mymusic;
