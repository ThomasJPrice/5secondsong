import ArtistSelection from "@/components/shared/ArtistSelection";

export default function Home() {
  return (
    <div className="container py-4">
      {/* header */}
      <div className="text-center">
        <h1 className="font-primary text-4xl md:text-5xl text-primary">Guess the Song</h1>
        <p className="text-lg">Choose an artist and guess 10 of their songs from a 5-second clip!</p>
      </div>

      <ArtistSelection />
    </div>
  );
}
