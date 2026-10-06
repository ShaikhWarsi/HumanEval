// components/tests/verbal-memory-test.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useScore } from "@/lib/score-context"
import { sound } from "@/lib/audio"
import BellCurve from "@/components/bell-curve"
import { MessageSquare, RotateCcw } from "lucide-react"

type GameState = "instructions" | "playing" | "result"

const INITIAL_WORD_POOL = [
  "algorithm", "bandwidth", "circuit", "database", "entropy", "frequency",
  "gateway", "heuristic", "iteration", "junction", "kernel", "latency",
  "matrix", "network", "optical", "protocol", "quantum", "resonance",
  "synapse", "telemetry", "universe", "velocity", "wavelength", "zenith",
  "aperture", "binary", "compiler", "dichotomy", "effector", "feedback",
  "gradient", "hardware", "induction", "kinetics", "logic", "modem",
  "neuron", "orbital", "photon", "qubit", "refraction", "spectrum",
  "topology", "upgrade", "vector", "waveform", "yield", "zero",
  "absolute", "beacon", "catalyst", "dynamic", "electron", "flux",
  "gyroscope", "horizon", "impulse", "joule", "kelvin", "lumbar",
  "monolith", "nucleus", "oscillator", "plasma", "quark", "radiation",
  "silicon", "trajectory", "uranium", "vacuum", "watt", "xenon",
  "acoustic", "biosphere", "cadence", "diffraction", "emission", "fission",
  "gravity", "hydraulics", "isotope", "laser", "magnet", "nebula",
  "optics", "pulsar", "radar", "satellite", "thermodynamics", "ultrasound",
  "valence", "volt", "amplifier", "battery", "capacitor",
  "diode", "electrode", "filament", "generator", "harness", "inverter",
  "lumens", "microchip", "nanometer", "ohm", "particle", "rectifier",
  "solenoid", "transistor", "ultraviolet", "varistor", "winding", "actuator",
  "bistable", "coulomb", "deflector", "elastomer", "ferrite", "governor",
  "impedance", "kinematics", "magnetron", "potentiometer", "rheostat", "tachometer",
  "accelerator", "ballistics", "caliper", "dynamometer", "encoder", "flywheel",
  "gyro", "interferometer", "manometer", "nozzle", "odometer", "pyrometer",
  "radiometer", "spectrometer", "thermistor", "viscometer", "windlass", "anemometer",
  "chronometer", "dosimeter", "galvanometer", "hydrometer", "inclinometer", "luxmeter",
  "micrometer", "oscilloscope", "polarimeter", "refractometer", "seismometer", "turbidimeter",
  "antigen", "axon", "bacterium", "chromosome", "dendrite", "enzyme",
  "fungus", "genome", "hormone", "immunity", "jugular", "karyotype",
  "leukocyte", "mitochondria", "neuron", "organelle", "pathogen", "receptor",
  "stemcell", "telomere", "uracil", "vaccine", "whitehead", "xylem",
  "yeast", "zygote", "abyss", "boulder", "canyon", "delta",
  "estuary", "fjord", "geyser", "highland", "island", "jungle",
  "karst", "lagoon", "mesa", "oasis", "plateau", "quarry",
  "ridge", "savanna", "tundra", "upland", "valley", "wetland",
  "anchor", "bridge", "cathedral", "dome", "edifice", "fortress",
  "gallery", "hangar", "igloo", "jetty", "kiosk", "lighthouse",
  "monastery", "nexus", "obelisk", "pavilion", "quay", "ramp",
  "spire", "tower", "viaduct", "wharf", "atoll", "crater",
  "dune", "escarpment", "faultline", "glacier", "headland", "iceberg",
  "keystone", "limestone", "moraine", "outcrop", "pinnacle", "ravine",
  "sinkhole", "trench", "volcano", "watershed", "zenith", "archipelago",
  "badlands", "chasm", "drumlin", "estuary", "fissure", "geode",
  "hotspring", "inselberg", "kame", "lava", "magma", "nunatak",
  "oxbow", "peninsula", "quartzite", "rift", "sandbar", "tarn",
  "vent", "waterfall", "basalt", "calcite", "diorite", "epidote",
  "feldspar", "granite", "halite", "igneous", "jasper", "kimberlite",
  "lignite", "mica", "nephrite", "obsidian", "pumice", "rhyolite",
  "schist", "talc", "ultramafic", "vesicle", "wollastonite", "zeolite",
  "anvil", "bellows", "chisel", "drill", "engine", "forge",
  "gasket", "hammer", "impeller", "joist", "knurling", "lathe",
  "mandrel", "nut", "oiler", "pulley", "ratchet", "spindle",
  "tappet", "universal", "valve", "wrench", "yoke", "camshaft",
  "crankshaft", "differential", "exhaust", "flywheel", "gearbox", "housing",
  "injector", "journal", "linkage", "manifold", "pinion", "rocker",
  "supercharger", "throttle", "turbo", "valvehead", "wristpin", "aerofoil",
  "aileron", "bulkhead", "canard", "empennage", "fuselage", "gimbal",
  "horizon", "nacelle", "pitot", "rudder", "stabilizer", "trimtab",
  "winglet", "yaw", "altitude", "bearing", "compass", "drift",
  "elevation", "fix", "heading", "latitude", "longitude", "meridian",
  "nadir", "orbit", "pitch", "roll", "sextant", "track",
  "vector", "waypoint", "azimuth", "zenith", "barometer", "chronometer"
]

export default function VerbalMemoryTest() {
  const [gameState, setGameState] = useState<GameState>("instructions")
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [seenWords, setSeenWords] = useState<Set<string>>(new Set())
  const [currentWord, setCurrentWord] = useState("")
  const [isLocked, setIsLocked] = useState(false)
  const [percentile, setPercentile] = useState(50)

  const { addScore } = useScore()

  const pickNextWord = (currentSeen: Set<string>, lastWord: string) => {
    // 50% chance of showing a previously seen word if at least 3 seen words exist
    const shouldShowSeen = currentSeen.size >= 3 && Math.random() < 0.5

    if (shouldShowSeen) {
      const seenArray = Array.from(currentSeen).filter((w) => w !== lastWord)
      if (seenArray.length > 0) {
        const word = seenArray[Math.floor(Math.random() * seenArray.length)]
        setCurrentWord(word)
        setIsLocked(false)
        return
      }
    }

    // Pick a novel word not yet seen
    const unvisited = INITIAL_WORD_POOL.filter((w) => !currentSeen.has(w) && w !== lastWord)
    if (unvisited.length > 0) {
      const word = unvisited[Math.floor(Math.random() * unvisited.length)]
      setCurrentWord(word)
    } else {
      // Procedurally append indexed words if dictionary is saturated
      const word = `stimulus_${currentSeen.size + 1}`
      setCurrentWord(word)
    }
    setIsLocked(false)
  }

  const startGame = () => {
    setScore(0)
    setLives(3)
    const newSeen = new Set<string>()
    setSeenWords(newSeen)
    setGameState("playing")
    setIsLocked(false)
    pickNextWord(newSeen, "")
  }

  const handleDecision = (userClickedSeen: boolean) => {
    if (gameState !== "playing" || isLocked) return
    setIsLocked(true)

    const isActuallySeen = seenWords.has(currentWord)

    if (userClickedSeen === isActuallySeen) {
      // Correct!
      sound.playClick()
      const newScore = score + 1
      setScore(newScore)

      // Add to seen set if it was novel
      const updatedSeen = new Set(seenWords)
      updatedSeen.add(currentWord)
      setSeenWords(updatedSeen)

      pickNextWord(updatedSeen, currentWord)
    } else {
      // Incorrect!
      sound.playError()
      const newLives = lives - 1
      setLives(newLives)

      // Even on failure, word is now encountered
      const updatedSeen = new Set(seenWords)
      updatedSeen.add(currentWord)
      setSeenWords(updatedSeen)

      if (newLives <= 0) {
        // Game Over!
        const saved = addScore({
          testId: "verbal-memory",
          testName: "Verbal Memory",
          score: score,
          unit: "words",
          details: { livesRemaining: 0, seenWordCount: seenWords.size },
        })
        setPercentile(saved.percentile)
        setGameState("result")
      } else {
        pickNextWord(updatedSeen, currentWord)
      }
    }
  }

  if (gameState === "instructions") {
    return (
      <div className="max-w-2xl mx-auto brutal-card p-8 sm:p-12 text-center font-sans">
        <div className="w-16 h-16 border-2 border-black dark:border-slate-700 bg-amber-400 dark:bg-sky-400 text-slate-950 flex items-center justify-center mx-auto mb-6 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000]">
          <MessageSquare className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-foreground mb-3">
          Verbal Working Memory
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto mb-8 font-sans">
          You will be shown words one by one. If you have seen the word before in this session, click{" "}
          <strong className="text-foreground uppercase font-black">SEEN</strong>. If it is novel, click{" "}
          <strong className="text-foreground uppercase font-black">NEW</strong>. 3 strikes and the test terminates.
        </p>

        <Button
          onClick={startGame}
          size="lg"
        >
          Start Verbal Test
        </Button>
      </div>
    )
  }

  if (gameState === "result") {
    return (
      <div className="max-w-2xl mx-auto brutal-card p-8 text-center font-sans">
        <div className="w-16 h-16 border-2 border-black dark:border-slate-700 bg-amber-400 dark:bg-sky-400 text-slate-950 flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#000000]">
          <MessageSquare className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-xs uppercase text-muted-foreground tracking-wider mb-1 font-bold font-mono">
          Lexical Memory Score
        </h2>
        <div className="text-6xl font-black text-foreground mb-2 tabular font-mono">
          {score}
          <span className="text-2xl text-amber-500 dark:text-sky-400 ml-1">words</span>
        </div>

        <p className="text-sm font-medium text-muted-foreground mb-6 font-sans">
          Vocabulary Buffer: <strong className="text-foreground font-mono">{seenWords.size}</strong> unique words retained
        </p>

        <BellCurve testId="verbal-memory" score={score} unit="words" percentile={percentile} />

        <div className="flex gap-3 justify-center mt-6">
          <Button
            onClick={startGame}
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto space-y-4 font-sans">
      {/* Telemetry bar */}
      <div className="flex items-center justify-between text-xs font-mono font-bold uppercase px-2">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Lives:</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((heart) => (
              <div
                key={heart}
                className={`w-3.5 h-3.5 border-2 border-black dark:border-slate-700 shadow-[1px_1px_0px_0px_#0A0A0A] ${
                  heart <= lives ? "bg-rose-500" : "bg-card"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            Bank: <strong className="text-foreground tabular">{seenWords.size}</strong>
          </span>
          <span className="text-muted-foreground">
            Score: <strong className="text-amber-500 dark:text-sky-400 tabular text-sm">{score}</strong>
          </span>
        </div>
      </div>

      {/* Main Word Card */}
      <div className="brutal-card p-10 sm:p-16 text-center space-y-8">
        <div className="text-4xl sm:text-6xl font-black font-display text-foreground tracking-wide select-none">
          {currentWord}
        </div>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            onClick={() => handleDecision(true)}
            size="lg"
            className="flex-1 max-w-[180px] bg-cyan-400 text-slate-950 py-6 text-base font-black shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#000000] hover:bg-cyan-300"
          >
            SEEN
          </Button>

          <Button
            onClick={() => handleDecision(false)}
            size="lg"
            className="flex-1 max-w-[180px] bg-amber-400 text-slate-950 py-6 text-base font-black shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#000000] hover:bg-amber-300"
          >
            NEW
          </Button>
        </div>
      </div>
    </div>
  )
}
