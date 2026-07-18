import re

with open('src/components/InteractiveMatchModal.tsx', 'r') as f:
    content = f.read()

animated_number_component = """
function AnimatedNumber({ target }: { target: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTime: number;
    const duration = 1500; // 1.5 seconds of fast rolling
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      if (progress < duration) {
        // Random number during rolling
        setCurrent(Math.floor(Math.random() * 100) + 1);
        requestAnimationFrame(animate);
      } else {
        // Set final target
        setCurrent(target);
      }
    };
    
    requestAnimationFrame(animate);
  }, [target]);

  return <span className={current === target ? (target <= 50 ? "text-emerald-400" : "text-white") : "text-white"}>{current}</span>;
}

export function InteractiveMatchModal({
"""

content = content.replace("export function InteractiveMatchModal({", animated_number_component)

# Fix the AnimatedNumber styling to reflect success vs fail based on the chance (not fixed 50)
content = content.replace(
    '<AnimatedNumber target={diceRollInfo.rollValue} />',
    '<AnimatedNumber target={diceRollInfo.rollValue} chance={diceRollInfo.chance} />'
)

animated_number_component_fixed = """
function AnimatedNumber({ target, chance }: { target: number, chance: number }) {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let startTime: number;
    const duration = 1500; // 1.5 seconds of fast rolling
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      if (progress < duration) {
        // Random number during rolling
        setCurrent(Math.floor(Math.random() * 100) + 1);
        requestAnimationFrame(animate);
      } else {
        // Set final target
        setCurrent(target);
        setDone(true);
      }
    };
    
    requestAnimationFrame(animate);
  }, [target]);

  let colorClass = "text-white";
  if (done) {
     colorClass = target <= chance ? "text-emerald-400 scale-125 transition-transform" : "text-red-500 scale-125 transition-transform";
  }

  return <span className={`inline-block ${colorClass}`}>{current}</span>;
}
"""

content = re.sub(r'function AnimatedNumber.*?return.*?\}', animated_number_component_fixed, content, flags=re.DOTALL)

with open('src/components/InteractiveMatchModal.tsx', 'w') as f:
    f.write(content)
