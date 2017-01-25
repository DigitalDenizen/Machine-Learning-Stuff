import re
def validate_pin(pin):

    match = bool(re.search(r"([a-zA-Z_])", pin))
    newBool = (len(pin) == 4 or len(pin) == 6) and match is not True
    return newBool


print(validate_pin('12345'));
print(validate_pin('1234'));
print(validate_pin('a123'));
print(validate_pin('a1b3bb'));
