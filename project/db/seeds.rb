# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

bob = User.where(login: "bob").first_or_create!(
	name: "bob",
);

bob.avatar.attach(
	io: URI.open("https://cdn.shopify.com/s/files/1/0240/3441/0601/products/135.png?v=1598373418"),
	filename: "bob.png",
	"content_type": "image/png",
)

Guild.create(name: 'The Best Guild', ang: "TBG", points: 0)
Guild.create(name: 'The Doom', ang: "TDM", points: 2)
