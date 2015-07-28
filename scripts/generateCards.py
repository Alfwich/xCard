import json, random, sys

OUT_FILE = "cards.json"
CARDS = [
	[ "Heir With Gold", 0 ],
	[ "Duchess Of Greatness", 0 ],
	[ "Assassins Of History", 0 ],
	[ "Humans Of Time", 0 ],
	[ "Gangsters And Guardians", 0 ],
	[ "Serpents And Lords", 0 ],
	[ "Demise Of Twilight", 0 ],
	[ "Shield Of Hell", 0 ],
	[ "Searching At Secrets", 0 ],
	[ "Dead At The Mist", 0 ],
	[ "Wife Without A Home", 0 ],
	[ "Swindler Without Shame", 0 ],
	[ "Lions With Silver", 0 ],
	[ "Friends Of Reality", 0 ],
	[ "Friends And Serpents", 0 ],
	[ "Snakes And Strangers", 0 ],
	[ "Failure Of Freedom", 0 ],
	[ "Foundation Of History", 0 ],
	[ "Visiting The World", 0 ],
	[ "Death At The Void", 0 ],
	[ "Raven Of Silver", 0 ],
	[ "Opponent With Honor", 0 ],
	[ "Butchers Of The Mountain", 0 ],
	[ "Invaders Of Sorrow", 0 ],
	[ "Enemies And Officers", 1 ],
	[ "Snakes And Guardians", 0 ],
	[ "Fruit Without Faith", 0 ],
	[ "Goal Of Silver", 0 ],
	[ "Sounds In My Past", 0 ],
	[ "Belonging To Myself", 0]
]

def genId():
	genId.current += 1
	return genId.prefix + hex( genId.current ).split("0x")[1]

genId.current = (16**4)-1
genId.prefix = ''.join([random.choice('0123456789abcdef') for x in range(19)])


def genCard(name, targets):
	result = {
		"_id": genId(),
		"title": name,
		"body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius metus quis tempus venenatis. Ut non ultricies mi, a blandit lorem. Vestibulum blandit sem et sem semper maximus. Vestibulum quis accumsan odio, vel eleifend elit. Curabitur ultrices risus ac auctor malesuada. Aenean accumsan leo at elit commodo faucibus. Praesent tempus enim vitae fringilla faucibus. Pellentesque sodales maur",
		"image": "test0%d.jpg" % ( random.randint(1,9) ),
		"targets": targets,
		"manaCost": 1
	}
	return result

def main():
	cards = [genCard(x[0],x[1]) for x in CARDS]
	with open( OUT_FILE, "w" ) as f:
		json.dump(cards,f)


if __name__ == "__main__":
	main()
