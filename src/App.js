import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import './index.css'; // Correct file extension
const App = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [lastPlayedTrack, setLastPlayedTrack] = useState(null);

  useEffect(() => {
    const storedLastTrack = localStorage.getItem('lastPlayedTrack');
    if (storedLastTrack) {
      setLastPlayedTrack(JSON.parse(storedLastTrack));
    }
  }, []);

  const onDrop = (acceptedFiles) => {
    const newPlaylist = [...playlist, ...acceptedFiles];
    setPlaylist(newPlaylist);
  };
  const playNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  const playPreviousTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'audio/*',
  });

  const handleTrackEnd = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  useEffect(() => {
    localStorage.setItem('lastPlayedTrack', JSON.stringify(lastPlayedTrack));
  }, [lastPlayedTrack]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Audio Player with Playlist</h1>
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-4 mb-4">
        <input {...getInputProps()} />
        <p className="text-gray-500">Drag & drop some audio files here, or click to select files</p>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Playlist</h2>
        <ul className="list-group p-0">
          {playlist.map((track, index) => (
            <li key={index} className="mb-2 list-group-item">
             
              <FontAwesomeIcon icon={faMusic} className="ml-2 " />
              <span className="m-2 text-gray-800">{track.name || 'Untitled Track'}</span>
              <button
                onClick={() => setCurrentTrackIndex(index)}
                className="btn btn-outline-primary btn-sm"
              >
                Play
              </button>
            </li>
          ))}
        </ul>

      </div>
      {playlist.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Now Playing</h2>
          <div className="flex items-center justify-between">
            <button
              onClick={playPreviousTrack}
              className="btn btn-primary ml-2"
              disabled={playlist.length === 1}
            >
              Previous
            </button>
            <audio
              className="w-50"
              controls
              autoPlay
              src={URL.createObjectURL(playlist[currentTrackIndex])}
              onEnded={playNextTrack}
              onPlay={() => setLastPlayedTrack(playlist[currentTrackIndex])}
            />
            <button
              onClick={playNextTrack}
              className="btn btn-primary ml-2"
              disabled={playlist.length === 1}
            >
              Next
            </button>
          </div>
          <p className="mt-2">Currently playing: {lastPlayedTrack?.name || 'Untitled Track'}</p>
        </div>
      )}
    </div>
  );
};

export default App;
