import userclass as userclass

class Pancake:
    def __init__(self, ingredient_book):
        self.bowl = {}
        self.ingredient_book = ingredient_book
        self.pancake_recipe = {
            "flour": 2,
            "baking powder": 1,
            "sugar": 1,
            "salt": 1,
            "milk": 1,
            "butter": 3,
            "egg": 1,
        }

        self.refridgerator_content = {
            "milk": 1,
            "butter": 3,
            "egg": 1,
        }

        self.transferring_refridgerator_content = {
        }

        self.cabinet_content = {
            "flour": 2,
            "baking powder": 1,
            "sugar": 1,
            "salt":1,
        }

    def addingredient_to_bowl(self, amount=1):
        ig = input("Enter the ingredient you want to add: ").strip().lower()
        if not self.ingredient_book.validingredient(ig):
            print(f"{ig} is not a valid ingredient.\n")
            return
        
        if ig.lower() in self.bowl:
            self.bowl[ig.lower()] += amount
        else:
            self.bowl[ig.lower()] = amount
        print(f"{amount} units of {ig.capitalize()} added to the bowl.")

    #gathering refridgerator ingredients and putting them in a 
    def pancake_1(self):
        if (position of the sprite) {
            #list contents of the refrigerator on click
            #list transferring contents that have been gathered
            #add ingredients to the transferring dictionary on click
            #be able to subtract from transferring contents on click
            #check contents of the transferring content to see if they are correct
        }

    
class refridgerator:
     def __init__(self):
         self.refridgerator_content = []



ingredient_book = userclass.IngredientBook()
pancake = Pancake(ingredient_book)


def main():
    print("Welcome to bunny bakery!\n")
    name = input("Please input your character name: ")

    user = userclass.User(name, 1, 0, None)

    ingredient_book = userclass.IngredientBook()

    if user.lvlcheck(userclass.dessert):
        pancake = Pancake(ingredient_book)
    else:
        print("Exiting the program...")



if __name__ == "__main__":
    main()
