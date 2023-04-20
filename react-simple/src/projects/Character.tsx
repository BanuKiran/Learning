export interface Origin {
  name: string;
}
export interface CharacterData {
  image: string;
  name: string;
  origin: Origin;
  key?: number;
  id?: number;
  gender: string;
}
export function Character(character: CharacterData) {
  return (
    <div className="col-3">
      <div className="card">
        <img src={character.image} alt={character.name} className="card-img-top" />
        <div className="card-body">
          <h3 className="card-title">{character.name}</h3>
          <p className="card-title">{character.gender}</p>
          <p>{`Origin: ${character.origin && character.origin.name}`}</p>
        </div>
      </div>
    </div>
  );
}
