class User:
    def __init__(self, name, lvl, xp, inventory):
        self.name = name
        self.lvl = lvl
        self.xp = xp
        self.inventory = inventory

    def create_character(self):
        player = User(input("please input your character name: "), 1, 0, None)
        print(f"charcter name: {player.name}\ncharacter lvl: {player.lvl}\ncharacter xp: {player.xp}\ncharacter inventory: {player.inventory}\n")

    def lvlcheck(self, dessert):
        if self.lvl >= dessert["pancake"]:
            return True
        else:
            print("You can not bake this item yet.")
            return False

dessert = {
    "pancake": 1,
    "strawberry bread": 2,
    "chocolate sundae cupcake": 3
}

class IngredientBook:
    def __init__(self):
        self.ingredients = {
            "flour": True,
            "baking powder": True,
            "sugar": True,
            "salt": True,
            "milk": True,
            "butter": True,
            "egg": True,
            "honey": True,
            "vanilla extract": True,
            "strawberry": True,
            "vegetable oil": True,
            "cocoa powder": True,
            "heavy cream": True,
            "powder sugar": True,
            "chocolate Ganache": True,
            "cherry": True
        }

    def validingredient(self, ingredient):
        return ingredient.lower() in self.ingredients
