import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { rickApi } from "../api/axios";

const fetchCharacter = async (id: string) => {
  const res = await rickApi.get(`/character/${id}`);
  return res.data;
};

const CharacterDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["character", id],
    queryFn: () => fetchCharacter(id!),
    enabled: !!id,
  });

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (isError || !data)
    return <div className="text-center mt-10">Character not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <img
          src={data.image}
          alt={data.name}
          className="w-48 h-48 rounded object-cover shadow-md"
        />
        <div className="text-left">
          <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
          <p>
            <strong>Status:</strong> {data.status}
          </p>
          <p>
            <strong>Species:</strong> {data.species}
          </p>
          <p>
            <strong>Gender:</strong> {data.gender}
          </p>
          <p>
            <strong>Location:</strong>{" "}
            <Link
              to={`/location/${data.location.url.split("/").pop()}`}
              className="underline"
            >
              {data.location.name}
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Episodes</h2>
        <ul className="list-none episode-lists">
          {data.episode.map((ep: string) => {
            const epId = ep.split("/").pop();
            return (
              <li key={epId}>
                <Link to={`/episode/${epId}`} className="underline">
                  Episode {epId}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default CharacterDetail;
