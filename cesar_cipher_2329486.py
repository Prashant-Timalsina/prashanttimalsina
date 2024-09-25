''' Student name: Prashant Timalsina
    Student ID: 2329486
'''

#  welcome message

def welcome():
    '''Provides a welcome message on program execution'''
    print('''
         Welcome to the Caesar Cipher    
    ''')
    print('''
    This program encrypts and decrypts text with the Caesar Cipher
    
    ''')

#  encripting alphabets leaving spaces as it is
def encrypt_message(text,shift):
    '''It provides ceaser cipher encryption of data according to ASCII alphabet placing'''
    cipher=""  #taking a empty variable
    for enum in range(len(text)):  #for loop till length of text
        char = text[enum]  #takes individual characters
        if char.isalpha():  #if the entered character is alphabet
            if char.isupper():   #if alphabet is capital
                cipher += chr(((ord(char) + shift)-65) % 26 + 65)  #concat with encripted alphabet
            else:   #if alphabet is small
                cipher += chr(((ord(char) + shift) - 97) % 26 + 97)
        else:   #if not alphabet
            cipher += char #concat the symbol/space
    return cipher.upper()

#  decripting alphabets leaving spaces as it is

def decrypt_message(cipher,shift):
    '''It provides ceaser cipher decryption of data according to ASCII alphabet placing'''
    text=""  #now a empty variable for decripted text
    for enum in range(len(cipher)):
        char = cipher[enum]
        if char.isalpha():
            if char.isupper():
                text += chr(((ord(char) - shift)-65) % 26 + 65)  #concat with decripted alphabets
            else:
                text += chr(((ord(char) - shift) - 97) % 26 + 97)
        else:
            text += char
    return text.upper()

def main():
    '''this function prompts user on encryption or decryption of data'''
    message=input('Would you like to encrypt(e) or decrypt(d): ')#user decisionin encript or decrypt
    if message.lower()=='e':                                            #if user inputs 'e'
        text=input('What message would you like to encrypt: ')
        shift=int(input('What is the shift number: '))
        cipher=encrypt_message(text,shift)                                  #call encripted text
        print("Encrypted text is ",cipher)
    elif message.lower()=='d':                                          #if user inputs 'd'
        cipher=input('What message would you like to decrypt: ')
        shift=int(input('What is the shift number: '))
        text=decrypt_message(cipher,shift)                                  #call decripted text
        print("Decrypted text is: ",text)
    else :                                                  # you need to input either e or d
        print('Invalid mode')

def bye():
    '''Gives a farewell message when user decides to terminate the program'''
    print("Thanks for using the program, goodbye!")

welcome() #calling welcome message

CHOICE = True
while CHOICE:
    main()
    more=input("Would you like to encryot or decrypt another message?(Y/N): ")
    if more.lower()=='y':
        CHOICE=True
    else:
        CHOICE=False
        bye()
