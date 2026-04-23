import sys
sys.path.insert(0, '.')
from run_agent import AIAgent
from model_tools import get_tool_definitions
print('AIAgent imported successfully')
tools = get_tool_definitions(enabled_toolsets=['file'])
print(f'Got {len(tools)} file tools')
for t in tools[:5]:
    name = t['function']['name']
    print(f'  - {name}')
