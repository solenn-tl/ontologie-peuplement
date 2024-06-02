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
    elements_str=';'.join(elements)
    
    return elements_str

def find_uuid(df, search_str):
    # Search for the string in all columns
    result = df[df.apply(lambda row: row.astype(str).str.contains(search_str).any(), axis=1)]

    # If a match is found, return the 'uuid' value
    if not result.empty:
        return result['uuid'].values[0]
    else:
        return 'No match found'