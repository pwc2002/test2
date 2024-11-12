"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Game() {
  const [username, setUsername] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [flies, setFlies] = useState<{ id: number; x: number; y: number }[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [rankings, setRankings] = useState<{ rank: number; username: string; time: number }[]>([]);
  const [gameEnded, setGameEnded] = useState(false);

  const flySettings: Record<string, { count: number; speed: number }> = {
    easy: { count: 3, speed: 2500 },
    medium: { count: 6, speed: 2000 },
    hard: { count: 9, speed: 1500 },
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted) {
      const { count } = flySettings[difficulty];
      const newFlies = Array.from({ length: count }, (_, index) => ({
        id: index,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
      }));
      setFlies(newFlies);
      setGameEnded(false);

      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
        setFlies((prevFlies) =>
          prevFlies.map((fly) => ({
            ...fly,
            x: Math.min(Math.max(fly.x + (Math.random() - 0.5) * 5, 10), 90),
            y: Math.min(Math.max(fly.y + (Math.random() - 0.5) * 5, 10), 90),
          }))
        );
      }, 100);

      return () => clearInterval(timer);
    }
  }, [gameStarted, difficulty, flySettings]);

  useEffect(() => {
    if (flies.length === 0 && gameStarted) {
      // 모든 파리를 잡았을 때 기록 저장
      axios.post('https://port-0-test2back-m3ecwpb257a84dfd.sel4.cloudtype.app/scores', {
        username,
        difficulty,
        time: parseFloat(time.toFixed(2)),
      }).then(() => {
        // 랭킹 가져오기
        axios.get(`https://port-0-test2back-m3ecwpb257a84dfd.sel4.cloudtype.app/rankings/${difficulty}`)
          .then((response) => {
            setRankings(response.data.rankings);
            setGameEnded(true);
          });
      }).catch((error) => {
        console.error('Error saving score:', error);
      });
      setGameStarted(false);
    }
  }, [flies, gameStarted, difficulty, time, username]);

  const handleStartGame = () => {
    setTime(0);
    setGameStarted(true);
    setRankings([]);

    // 게임 시작 시 파리 배열 초기화
    const { count } = flySettings[difficulty];
    const newFlies = Array.from({ length: count }, (_, index) => ({
      id: index,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
    }));
    setFlies(newFlies);
  };

  const handleCatchFly = (id: number) => {
    setFlies((prevFlies) => prevFlies.filter((fly) => fly.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      {!gameStarted && !gameEnded ? (
        <>
          <h1 className="text-2xl font-bold mb-4">순발력 테스트 게임</h1>
          <p className="mb-4">사용자의 반응 속도를 측정하고 경쟁할 수 있는 간단한 게임입니다.</p>
          
          <div className="mb-4">
            <label className="block mb-2">사용자 이름:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-2 w-full text-black"
              placeholder="이름을 입력하세요"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">난이도 선택:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="border p-2 w-full text-black"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <button
            onClick={handleStartGame}
            className="bg-blue-500 text-white p-2 rounded"
          >
            게임 시작
          </button>
        </>
      ) : gameEnded ? (
        <div>
          <h2 className="text-xl font-bold mb-2">게임 종료</h2>
          <p>기록: {time.toFixed(2)}초</p>
          {rankings.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-2">랭킹</h2>
              <ul>
                {rankings.map((rank, index) => (
                  <li key={index}>
                    {rank.rank}. {rank.username} - {rank.time}초
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-full h-96 bg-gray-100">
          {flies.map((fly) => (
            <div
              key={fly.id}
              onClick={() => handleCatchFly(fly.id)}
              className="absolute text-2xl cursor-pointer"
              style={{
                top: `${fly.y}%`,
                left: `${fly.x}%`,
              }}
            >
              🪰
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
