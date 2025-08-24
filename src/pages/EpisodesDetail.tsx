import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { rickApi } from "../api/axios";
import type { Character } from "../types/characters";

const fetchEpisode = async (id: string) => {
  const res = await rickApi.get(`/episode/${id}`);
  return res.data;
};

const fetchCharactersByIds = async (ids: string[]) => {
  const res = await rickApi.get(`/character/${ids.join(",")}`);
  return Array.isArray(res.data) ? res.data : [res.data];
};

const EpisodeDetail = () => {
  const { id } = useParams();

  const {
    data: episode,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["episode", id],
    queryFn: () => fetchEpisode(id!),
    enabled: !!id,
  });

  const characterIds = episode?.characters.map((url: string) =>
    url.split("/").pop()
  );

  const { data: characters } = useQuery({
    queryKey: ["episode-characters", id],
    queryFn: () => fetchCharactersByIds(characterIds),
    enabled: !!characterIds?.length,
  });

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (isError || !episode)
    return <div className="text-center mt-10">Episode not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">{episode.name}</h1>
      <p>
        <strong>Air Date:</strong> {episode.air_date}
      </p>
      <p>
        <strong>Episode Number:</strong> {episode.episode}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-4">
        Characters in this Episode:
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {characters?.map((char: Character) => (
          <Link
            to={`/characters/${char.id}`}
            key={char.id}
            className="group bg-white pb-2 rounded shadow text-center transform transition-transform duration-300 ease-in-out hover:scale-105 border-4 hover:border-[#97CE4C]"
          >
            <img
              src={char.image}
              alt={char.name}
              className="rounded mb-2 w-full aspect-square object-cover"
            />
            <h3 className="font-semibold text-gray-800 group-hover:text-[#00B1CA] transition-colors duration-300">
              {char.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EpisodeDetail;
