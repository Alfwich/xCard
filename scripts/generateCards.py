import json, random, sys

OUT_FILE = "cards.json"
RANDOM_TITLES = [
	"Heir With Gold",
	"Duchess Of Greatness",
	"Assassins Of History",
	"Humans Of Time",
	"Gangsters And Guardians",
	"Serpents And Lords",
	"Demise Of Twilight",
	"Shield Of Hell",
	"Searching At Secrets",
	"Dead At The Mist",
	"Wife Without A Home",
	"Swindler Without Shame",
	"Lions With Silver",
	"Friends Of Reality",
	"Friends And Serpents",
	"Snakes And Strangers",
	"Failure Of Freedom",
	"Foundation Of History",
	"Visiting The World",
	"Death At The Void",
	"Raven Of Silver",
	"Opponent With Honor",
	"Butchers Of The Mountain",
	"Invaders Of Sorrow",
	"Enemies And Officers",
	"Snakes And Guardians",
	"Fruit Without Faith",
	"Goal Of Silver",
	"Sounds In My Past",
	"Belonging To Myself"
]

def genCard(name):
	result = { "title": name, "body": "card body", "image": "test0%d.jpg" % ( random.randint(1,9) ) }
	return result

def main():
	cards = [genCard(x) for x in RANDOM_TITLES]
	with open( OUT_FILE, "w" ) as f:
		json.dump(cards,f)


if __name__ == "__main__":
	main()
