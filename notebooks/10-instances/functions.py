import re

#function to parese string like "FRAD094_3P_000255_01_0015" and return a list of values ["FRAD094","3P","000255","01","0015"]
def parse_record_id_as_list(image):
    return image.split("_")

#function to remove 0+ from the beginning of a string
def remove_0(string):
    return string.lstrip("0")

#create a function that parse a string "FRAD094_3P_000255_01_0526"
def parse_record_id(record_id):
    record_id = record_id.replace("FRAD","")
    record_id = record_id.split("_")
    record_id = [x.lstrip("0") for x in record_id]
    return {
        "departement": record_id[0].lstrip("0"),
        "serie": record_id[1],
        "recordSetId": record_id[2],
        "recordSetsplit": record_id[3],
        "pageId": record_id[4]
    }

def cleanNumFolio(cell,symbols):
    symbols_str = ''.join(symbols)
    pattern = '[' + symbols_str + ']'

    cell = str(cell).lower()
    if any(char.isdigit() for char in str(cell)):
        #split the cell into a list of strings each time one of the symbols list element appears
        cell_split = re.split(pattern, cell)
        cell_split = [re.sub(r'↑[a-zA-Z]+↓', '', str(c)) for c in cell_split]
    elif cell == 'nan':
        cell_split = ['EMPTY']
    else:
        #traiter les évènements spéciaux
        cell_split = [cell]
    elements = [re.sub(r'²', r'↑2↓', str(c)) for c in cell_split]

    if len(elements) > 1:
        print(elements)
        elements_str=';'.join(elements)
    else:
        elements_str = elements[0]
    
    if elements_str[-1] == ';':
        elements_str = elements_str[:-1]
    if elements_str[0] == ';':
        elements_str = elements_str[1:]
    if ';;' in elements_str:
        elements_str = elements_str.replace(';;',';')
    
    return elements_str

def find_uuid(df, search_str):
    # Search for the string in all columns
    result = df[df.apply(lambda row: row.astype(str).str.contains(search_str).any(), axis=1)]

    # If a match is found, return the 'uuid' value
    if not result.empty:
        return result['uuid'].values[0]
    else:
        return 'No match found'
    
import re

def separate_stripped_strings(s):
    """
    This function separates a string into two lists of strings:
    - one containing the strings outside of the double tildes ~~
    - one containing the strings inside the double tildes
    """
    matches = re.findall(r'~~(.*?)~~', s)
    if matches:
        parts = re.split(r'~~(.*?)~~', s)
        outside_tildes = []
        inside_tildes = []
        for i in range(len(parts)):
            if i % 2 == 0:
                stripped_part = parts[i].strip()
                if stripped_part:
                    outside_tildes.append([stripped_part, i])
            else:
                match = matches.pop(0)
                if match:
                    inside_tildes.append([match, i])
        for o in outside_tildes:
            if o[0][0] == ';':
                o[0] = o[0][1:]
        for i in inside_tildes:
            if i[0][0] == ';':
                i[0] = i[0][1:]
        return outside_tildes, inside_tildes
    else:
        return [s], []

