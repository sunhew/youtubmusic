import React, { useEffect, useState } from 'react';

const Modal = ({ isOpen, onClose, onAddToPlaylist }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // 모달 열리면 스크롤 비활성화
      const count = Number(localStorage.getItem('playlistCount')) || 0;
      const loadedPlaylists = [];
      for (let i = 1; i <= count; i++) {
        const playlistKey = `playlist${i}`;
        const playlist = JSON.parse(localStorage.getItem(playlistKey));
        if (playlist) {
          loadedPlaylists.push(playlist);
        }
      }
      setPlaylists(loadedPlaylists);
    } else {
      document.body.style.overflow = 'auto'; // 모달 닫히면 스크롤 활성화
    }

    return () => {
      document.body.style.overflow = 'auto'; // 컴포넌트 언마운트 시 스크롤 활성화
    };
  }, [isOpen]);

  const handleAddClick = (playlistId) => {
    onAddToPlaylist(playlistId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>플레이리스트 선택</h2>
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              <span>{playlist.name}</span>
              <button onClick={() => handleAddClick(playlist.id)}>추가</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Modal;
